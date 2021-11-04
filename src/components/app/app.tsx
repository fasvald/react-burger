import React, { useEffect, useMemo, useState } from 'react'

import Cookies from 'js-cookie'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Routes, Route, useLocation, useNavigationType, Navigate } from 'react-router-dom'

import { isInstanceOfModalRouteLocationState } from '../../common/guards/routing.guards'
import { IModalRouteLocationState } from '../../common/models/routing.model'
import { useAppDispatch, useAppSelector } from '../../hooks'
import ForgotPasswordPage from '../../pages/forgot-password/forgot-password-page'
import LoginPage from '../../pages/login/login-page'
import NotFoundPage, { RedirectToNotFound } from '../../pages/not-found/not-found-page'
import OrderListPage from '../../pages/profile/order-list/order-list-page'
import ProfilePage from '../../pages/profile/profile-page'
import UserDetailsPage from '../../pages/profile/user-details/user-details-page'
import RegisterPage from '../../pages/register/register-page'
import ResetPasswordPage from '../../pages/reset-password/reset-password-page'
import { authSelector, saveAuthorizedUser } from '../../services/slices/auth.slice'
import { getUser } from '../../services/slices/user.slice'
import BurgerConstructor from '../burger-constructor/burger-constructor'
import BurgerIngredients from '../burger-ingredients/burger-ingredients'
import { getIngredients } from '../burger-ingredients/burger-ingredients.slice'
import IngredientDetails from '../ingredient-details/ingredient-details'
import LoaderCircular from '../loader-circular/loader-circular'
import Modal from '../modal/modal'

import AppContent from './app-content/app-content'
import AppFooter from './app-footer/app-footer'
import AppHeader from './app-header/app-header'

import styles from './app.module.css'

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAppSelector(authSelector)

  const location = useLocation()

  if (!auth.user) {
    return <Navigate to='/login' state={{ from: location }} />
  }

  return children
}

const App = (): JSX.Element => {
  const [appIsReady, setAppIsReady] = useState(false)

  const auth = useAppSelector(authSelector)

  const navigationType = useNavigationType()

  const location: Location | { state: IModalRouteLocationState } = useLocation()

  const dispatch = useAppDispatch()

  const backgroundLocation = useMemo(() => {
    if (isInstanceOfModalRouteLocationState(location.state)) {
      return (
        (navigationType === 'PUSH' || navigationType === 'REPLACE') &&
        location.state &&
        location.state?.background
      )
    }

    return undefined
  }, [location, navigationType])

  useEffect(() => {
    const setUpApp = async () => {
      const refreshToken = Cookies.get('sb-refreshToken')

      if (refreshToken && !auth.user) {
        const resultAction = await dispatch(getUser())

        if (getUser.fulfilled.match(resultAction)) {
          dispatch(saveAuthorizedUser(resultAction.payload.user))
        }
      }

      await dispatch(getIngredients())

      setAppIsReady(true)
    }

    setUpApp()
  }, [auth.isLoggedIn, auth.user, dispatch])

  return (
    <div className={styles.wrapper}>
      <AppHeader className={styles.header} />
      <AppContent className={styles.content}>
        {!appIsReady ? (
          <div className={styles.loaderWrapper}>
            <LoaderCircular />
          </div>
        ) : (
          <>
            <Routes location={backgroundLocation || location}>
              <Route
                path='/'
                element={
                  <DndProvider backend={HTML5Backend}>
                    <BurgerIngredients />
                    <BurgerConstructor />
                  </DndProvider>
                }
              />
              <Route path='ingredients/:id' element={<IngredientDetails isFullSizePage />} />
              <Route path='login' element={<LoginPage />} />
              <Route path='register' element={<RegisterPage />} />
              <Route path='forgot-password' element={<ForgotPasswordPage />} />
              <Route path='reset-password' element={<ResetPasswordPage />} />
              <Route path='not-found' element={<NotFoundPage />} />
              <Route
                path='profile'
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                }
              >
                {/* NOTE: We can make path for root route like this "profile/*" and move those routes into + removing Outlet */}
                <Route path='' element={<UserDetailsPage />} />
                <Route path='orders' element={<OrderListPage />} />
              </Route>
              <Route path='*' element={<RedirectToNotFound />} />
            </Routes>
            {backgroundLocation && (
              <Routes>
                <Route
                  path='ingredients/:id'
                  element={
                    <Modal open isModalRoute>
                      <IngredientDetails />
                    </Modal>
                  }
                />
              </Routes>
            )}
          </>
        )}
      </AppContent>
      <AppFooter className={styles.footer} />
    </div>
  )
}

export default React.memo(App)
