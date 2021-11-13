import React, { useMemo } from 'react'

import classNames from 'classnames'

import LoaderCircular from '@components/loader-circular/loader-circular'
import { useAppSelector } from '@hooks'

import BurgerIngredientsList from './burger-ingredients-list/burger-ingredients-list'
import { ingredientsSelector, ingredientsFetchStatusSelector } from './burger-ingredients.slice'

import styles from './burger-ingredients.module.css'

const BurgerIngredients = (): JSX.Element => {
  const ingredients = useAppSelector(ingredientsSelector)
  const status = useAppSelector(ingredientsFetchStatusSelector)

  const sectionTitleClass = useMemo(() => classNames('text text_type_main-large', styles.title), [])

  return (
    <section className={styles.section}>
      {status === 'loading' && <LoaderCircular />}
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
