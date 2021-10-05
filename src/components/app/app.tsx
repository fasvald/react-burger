import React from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import LoginPage from '../../pages/login/login-page'
import NotFoundPage from '../../pages/not-found/not-found-page'
import BurgerConstructor from '../burger-constructor/burger-constructor'
import BurgerIngredients from '../burger-ingredients/burger-ingredients'

import AppContent from './app-content/app-content'
import AppFooter from './app-footer/app-footer'
import AppHeader from './app-header/app-header'

import styles from './app.module.css'

const App = (): JSX.Element => {
  return (
    <Router>
      <div className={styles.wrapper}>
        <AppHeader className={styles.header} />
        <AppContent className={styles.content}>
          <Switch>
            <Route exact path='/'>
              <DndProvider backend={HTML5Backend}>
                <BurgerIngredients />
                <BurgerConstructor />
              </DndProvider>
            </Route>
            <Route path='/login' component={LoginPage} />
            {/* NOTE: WE can omit asterisk character here */}
            <Route path='*' component={NotFoundPage} />
          </Switch>
        </AppContent>
        <AppFooter className={styles.footer} />
      </div>
    </Router>
  )
}

export default App
