import React, { useEffect, useState } from 'react'

import {
  IBurgerIngredient,
  IBurgerIngredientFetch,
  TFetchProcess,
} from '../../common/models/data.model'
import BurgerConstructor from '../burgers/burger-constructor/burger-constructor'
import { BurgerConstructorProvider } from '../burgers/burger-constructor/burger-constructor.context'
import BurgerIngredients from '../burgers/burger-ingredients/burger-ingredients'
import Loader from '../loader/loader'

import AppContent from './app-content/app-content'
import AppFooter from './app-footer/app-footer'
import AppHeader from './app-header/app-header'
import { INGREDIENTS_API_ENDPOINT } from './app.constant'

import styles from './app.module.css'

const App = (): JSX.Element => {
  const [status, setStatus] = useState<TFetchProcess>('idle')
  const [ingredients, setIngredients] = useState<IBurgerIngredient[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const fetchIngredients = async () => {
      setStatus('loading')

      try {
        const response = await fetch(INGREDIENTS_API_ENDPOINT, { signal })
        const result: IBurgerIngredientFetch = await response.json()

        setStatus('loaded')
        setIngredients(result.data)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)

        setStatus('error')
        setIngredients([])
      }
    }

    fetchIngredients()

    return () => {
      controller.abort()
    }
  }, [])

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
            <BurgerConstructorProvider>
              <BurgerIngredients ingredients={ingredients} />
              <BurgerConstructor />
            </BurgerConstructorProvider>
          </>
        )}
      </AppContent>
      <AppFooter className={styles.footer} />
    </div>
  )
}

export default App
