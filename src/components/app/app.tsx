import React, { useEffect, useMemo, useState } from 'react'

import { Location } from 'history'
import Cookies from 'js-cookie'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Switch, Route, useLocation, useHistory } from 'react-router-dom'

import { isInstanceOfModalRouteLocationState } from '../../common/guards/routing.guards'
import { IModalRouteLocationState } from '../../common/models/routing.model'
import { useAppDispatch, useAppSelector } from '../../hooks'
import ForgotPasswordPage from '../../pages/forgot-password/forgot-password-page'
import LoginPage from '../../pages/login/login-page'
import NotFoundPage, { RedirectToNotFound } from '../../pages/not-found/not-found-page'
import ProfilePage from '../../pages/profile/profile-page'
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
import ProtectedRoute from '../routing/protected-route/protected-route'

import AppContent from './app-content/app-content'
import AppFooter from './app-footer/app-footer'
import AppHeader from './app-header/app-header'

import styles from './app.module.css'

const App = (): JSX.Element => {
  const [appIsReady, setAppIsReady] = useState(false)

  const auth = useAppSelector(authSelector)

  const history = useHistory()
  const location = useLocation<IModalRouteLocationState | Location>()

  const dispatch = useAppDispatch()

  const backgroundLocation = useMemo(() => {
    if (isInstanceOfModalRouteLocationState(location.state)) {
      return (
        (history.action === 'PUSH' || history.action === 'REPLACE') &&
        location.state &&
        location.state.background
      )
    }

    return undefined
  }, [location, history.action])

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
            <Switch location={backgroundLocation || location}>
              <Route exact path='/'>
                <DndProvider backend={HTML5Backend}>
                  <BurgerIngredients />
                  <BurgerConstructor />
                </DndProvider>
              </Route>
              <Route path='/ingredients/:id'>
                <IngredientDetails isFullSizePage />
              </Route>
              <Route path='/login'>
                <LoginPage />
              </Route>
              <Route path='/register'>
                <RegisterPage />
              </Route>
              <Route path='/forgot-password'>
                <ForgotPasswordPage />
              </Route>
              <Route path='/reset-password'>
                <ResetPasswordPage />
              </Route>
              <Route path='/not-found'>
                <NotFoundPage />
              </Route>
              <ProtectedRoute path='/profile'>
                <ProfilePage />
              </ProtectedRoute>
              <Route path='*'>
                <RedirectToNotFound />
              </Route>
            </Switch>
            {backgroundLocation && (
              <Route path='/ingredients/:id'>
                <Modal open isModalRoute>
                  <IngredientDetails />
                </Modal>
              </Route>
            )}
          </>
        )}
      </AppContent>
      <AppFooter className={styles.footer} />
    </div>
  )
}

export default React.memo(App)
