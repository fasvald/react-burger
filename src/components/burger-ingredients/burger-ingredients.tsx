import React, { useEffect, useMemo } from 'react'

import classNames from 'classnames'
import { Location } from 'history'

import { IModalRouteLocationState } from '../../common/models/routing.model'
import { useAppDispatch, useAppSelector } from '../../hooks'
import Loader from '../loader-circular/loader-circular'

import BurgerIngredientsList from './burger-ingredients-list/burger-ingredients-list'
import {
  ingredientsSelector,
  ingredientsFetchStatusSelector,
  getIngredients,
} from './burger-ingredients.slice'

import styles from './burger-ingredients.module.css'

interface IBurgerIngredientsProps {
  modalLocation: IModalRouteLocationState | Location<unknown>
}

const BurgerIngredients = ({ modalLocation }: IBurgerIngredientsProps): JSX.Element => {
  const ingredients = useAppSelector(ingredientsSelector)
  const status = useAppSelector(ingredientsFetchStatusSelector)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const promise = dispatch(getIngredients())

    const fetchIngredients = async () => {
      await promise
    }

    fetchIngredients()

    return () => {
      promise && promise?.abort()
    }
  }, [dispatch])

  const sectionTitleClass = useMemo(() => classNames('text text_type_main-large', styles.title), [])

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
          <BurgerIngredientsList modalLocation={modalLocation} />
        </>
      )}
    </section>
  )
}

export default React.memo(BurgerIngredients)
