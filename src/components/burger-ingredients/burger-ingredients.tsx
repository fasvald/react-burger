import React, { useEffect } from 'react'

import classNames from 'classnames'

import { useAppDispatch, useAppSelector } from '../../hooks'
import Loader from '../loader/loader'

import BurgerIngredientsList from './burger-ingredients-list/burger-ingredients-list'
import {
  burgerIngredientsSelector,
  burgerIngredientsStatusSelector,
  fetchBurgerIngredients,
} from './burger-ingredients.slice'

import styles from './burger-ingredients.module.css'

const BurgerIngredients = (): JSX.Element => {
  const dispatch = useAppDispatch()

  const ingredients = useAppSelector(burgerIngredientsSelector)
  const status = useAppSelector(burgerIngredientsStatusSelector)

  const sectionTitleClass = classNames('text text_type_main-large', styles.title)

  useEffect(() => {
    dispatch(fetchBurgerIngredients())
  }, [dispatch])

  return (
    <section className={styles.section}>
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
          <h1 className={sectionTitleClass}>Соберите бургер</h1>
          <BurgerIngredientsList />
        </>
      )}
    </section>
  )
}

export default React.memo(BurgerIngredients)
