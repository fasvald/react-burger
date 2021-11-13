import React, { useEffect, useMemo, useState } from 'react'

import Cookies from 'js-cookie'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Routes, Route, useLocation, useNavigationType, Navigate } from 'react-router-dom'

import { isInstanceOfModalRouteLocationState } from '@common/guards/routing.guards'
import { IModalRouteLocationState } from '@common/models/routing.model'
import BurgerConstructor from '@components/burger-constructor/burger-constructor'
import BurgerIngredients from '@components/burger-ingredients/burger-ingredients'
import { getIngredients } from '@components/burger-ingredients/burger-ingredients.slice'
import LoaderCircular from '@components/loader-circular/loader-circular'
import Modal from '@components/modal/modal'
import ModalIngredientDetails from '@components/modal/modal-ingredient-details/modal-ingredient-details'
import ModalOrderDetails from '@components/modal/modal-order-details/modal-order-details'
import { useAppDispatch, useAppSelector } from '@hooks'
import FeedPage from '@pages/feed/feed-page'
import ForgotPasswordPage from '@pages/forgot-password/forgot-password-page'
import LoginPage from '@pages/login/login-page'
import NotFoundPage, { RedirectToNotFound } from '@pages/not-found/not-found-page'
import ProfileOrdersListPage from '@pages/profile/profile-orders-list/profile-orders-list-page'
import ProfilePage from '@pages/profile/profile-page'
import ProfileUserDetailsPage from '@pages/profile/profile-user-details/profile-user-details-page'
import RegisterPage from '@pages/register/register-page'
import ResetPasswordPage from '@pages/reset-password/reset-password-page'
import { authSelector, saveAuthorizedUser } from '@services/slices/auth.slice'
import { getUser } from '@services/slices/user.slice'

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
              <Route path='feed' element={<FeedPage />} />
              <Route path='feed/:orderNumber' element={<ModalOrderDetails isFullSizePage />} />
              <Route path='ingredients/:id' element={<ModalIngredientDetails isFullSizePage />} />
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
                <Route path='' element={<ProfileUserDetailsPage />} />
                <Route path='orders' element={<ProfileOrdersListPage />} />
              </Route>
              {/* After migration to react router v6 it's kinda hard to use nested API due to lack of documentation sources */}
              <Route
                path='profile/orders/:orderNumber'
                element={
                  <RequireAuth>
                    <ModalOrderDetails isFullSizePage />
                  </RequireAuth>
                }
              />
              <Route path='*' element={<RedirectToNotFound />} />
            </Routes>
            {backgroundLocation && (
              <Routes>
                <Route
                  path='ingredients/:id'
                  element={
                    <Modal open isModalRoute>
                      <ModalIngredientDetails />
                    </Modal>
                  }
                />
                <Route
                  path='feed/:orderNumber'
                  element={
                    <Modal open isModalRoute>
                      <ModalOrderDetails />
                    </Modal>
                  }
                />
                <Route
                  path='profile/orders/:orderNumber'
                  element={
                    <RequireAuth>
                      <Modal open isModalRoute>
                        <ModalOrderDetails />
                      </Modal>
                    </RequireAuth>
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
