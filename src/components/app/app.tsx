import React from 'react'

import BurgerConstructor from '../burger-constructor/burger-constructor'
import BurgerIngredients from '../burger-ingredients/burger-ingredients'

import AppContent from './app-content/app-content'
import AppFooter from './app-footer/app-footer'
import AppHeader from './app-header/app-header'

import styles from './app.module.css'

const App = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <AppHeader className={styles.header} />
      <AppContent className={styles.content}>
        <BurgerIngredients />
        <BurgerConstructor />
      </AppContent>
      <AppFooter className={styles.footer} />
    </div>
  )
}

export default App
