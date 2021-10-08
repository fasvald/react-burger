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
import { getProfile, updateProfileManually } from '../../services/slices/profile.slice'
import BurgerConstructor from '../burger-constructor/burger-constructor'
import BurgerIngredients from '../burger-ingredients/burger-ingredients'
import Loader from '../loader/loader'

import AppContent from './app-content/app-content'
import AppFooter from './app-footer/app-footer'
import AppHeader from './app-header/app-header'

import styles from './app.module.css'

const App = (): JSX.Element => {
  // Using local state we just making sure that firstly we check if there is a user or not and after that show the main app
  const [isLoaded, setIsLoaded] = useState(false)

  const auth = useAppSelector(authSelector)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const authToken = Cookies.get('sb-authToken')
    const refreshToken = Cookies.get('sb-refreshToken')

    const fetchProfile = async () => {
      const resultAction = await dispatch(getProfile())

      if (getProfile.fulfilled.match(resultAction)) {
        const { user: profile } = resultAction.payload

        dispatch(saveAuthorizedUser(profile))
        dispatch(updateProfileManually(profile))
      }
    }

    if (!auth.isLoggedIn && (authToken || refreshToken)) {
      fetchProfile()
    }

    setIsLoaded(true)
  }, [auth.isLoggedIn, dispatch])

  return (
    <Router>
      <div className={styles.wrapper}>
        <AppHeader className={styles.header} />
        <AppContent className={styles.content}>
          {!isLoaded && (
            <div className={styles.error}>
              <Loader />
            </div>
          )}
          {isLoaded && (
            <Switch>
              <Route exact path='/'>
                <DndProvider backend={HTML5Backend}>
                  <BurgerIngredients />
                  <BurgerConstructor />
                </DndProvider>
              </Route>
              <Route path='/login' component={LoginPage} />
              <Route path='/register' component={RegisterPage} />
              <Route path='/forgot-password' component={ForgotPasswordPage} />
              <Route path='/reset-password' component={ResetPasswordPage} />
              <Route path='/profile' component={ProfilePage} />
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
