import React, { useEffect, useState } from 'react'

import Cookies from 'js-cookie'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../hooks'
import ForgotPasswordPage from '../../pages/forgot-password/forgot-password-page'
import LoginPage from '../../pages/login/login-page'
import NotFoundPage from '../../pages/not-found/not-found-page'
import ProfilePage from '../../pages/profile/profile-page'
import RegisterPage from '../../pages/register/register-page'
import ResetPasswordPage from '../../pages/reset-password/reset-password-page'
import { authSelector, saveAuthorizedUser } from '../../services/slices/auth.slice'
import { getProfile } from '../../services/slices/profile.slice'
import BurgerConstructor from '../burger-constructor/burger-constructor'
import BurgerIngredients from '../burger-ingredients/burger-ingredients'
import Loader from '../loader/loader'
import ProtectedRoute from '../protected-route/protected-route'

import AppContent from './app-content/app-content'
import AppFooter from './app-footer/app-footer'
import AppHeader from './app-header/app-header'

import styles from './app.module.css'

const App = (): JSX.Element => {
  const [userIsReady, setUserIsReady] = useState(false)

  const auth = useAppSelector(authSelector)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const refreshToken = Cookies.get('sb-refreshToken')

    const setUpUser = async () => {
      if (refreshToken && !auth.user) {
        const resultAction = await dispatch(getProfile())

        if (getProfile.fulfilled.match(resultAction)) {
          dispatch(saveAuthorizedUser(resultAction.payload.user))
        }
      }

      setUserIsReady(true)

      return Promise.resolve()
    }

    setUpUser()
  }, [auth.isLoggedIn, auth.user, dispatch])

  return (
    <Router>
      <div className={styles.wrapper}>
        <AppHeader className={styles.header} />
        <AppContent className={styles.content}>
          {!userIsReady ? (
            <div className={styles.error}>
              <Loader />
            </div>
          ) : (
            <Switch>
              <Route exact path='/'>
                <DndProvider backend={HTML5Backend}>
                  <BurgerIngredients />
                  <BurgerConstructor />
                </DndProvider>
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
              <ProtectedRoute path='/profile'>
                <ProfilePage />
              </ProtectedRoute>
              {/* <Route path='/profile' component={ProfilePage} /> */}
              {/* NOTE: WE can omit asterisk character here */}
              <Route path='*' component={NotFoundPage} />
            </Switch>
          )}
        </AppContent>
        <AppFooter className={styles.footer} />
      </div>
    </Router>
  )
}

export default React.memo(App)
