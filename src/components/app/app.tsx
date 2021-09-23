import React, { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../hooks'
import BurgerConstructor from '../burger-constructor/burger-constructor'
import BurgerIngredients from '../burger-ingredients/burger-ingredients'
import {
  fetchBurgerIngredients,
  selectBurgerIngredients,
  selectBurgerIngredientsStatus,
} from '../burger-ingredients/burger-ingredients.slice'
import Loader from '../loader/loader'

import AppContent from './app-content/app-content'
import AppFooter from './app-footer/app-footer'
import AppHeader from './app-header/app-header'

import styles from './app.module.css'

const App = (): JSX.Element => {
  const ingredients = useAppSelector(selectBurgerIngredients)
  const status = useAppSelector(selectBurgerIngredientsStatus)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchBurgerIngredients())
  }, [dispatch])

  return (
    <div className={styles.wrapper}>
      <AppHeader className={styles.header} />
      <AppContent className={styles.content}>
        {status === 'loading' && <Loader />}
        {status === 'error' && (
          <div className={styles.error}>
            <p className='text text_type_main-medium'>
              Ингридиенты для бургера не смогли загрузиться. Повторите попытку.
            </p>
          </div>
        )}
        {status === 'loaded' && ingredients.length > 0 && (
          <>
            <BurgerIngredients ingredients={ingredients} />
            <BurgerConstructor />
          </>
        )}
      </AppContent>
      <AppFooter className={styles.footer} />
    </div>
  )
}

export default App
