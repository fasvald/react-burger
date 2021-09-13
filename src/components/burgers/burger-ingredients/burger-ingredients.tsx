import React from 'react'

import classNames from 'classnames'

import BurgerIngredientsList from './burger-ingredients-list/burger-ingredients-list'
import { IBurgerIngredientsProps } from './burger-ingredients.model'

import styles from './burger-ingredients.module.css'

const BurgerIngredients = ({ ingredients }: IBurgerIngredientsProps): JSX.Element => {
  return (
    <section className={styles.section}>
      <h1 className={classNames('text text_type_main-large', styles.title)}>Соберите бургер</h1>
      <BurgerIngredientsList ingredients={ingredients} />
    </section>
  )
}

export default BurgerIngredients
