import React from 'react'

import classNames from 'classnames'

import BurgerIngredientsCard from '../../burger-ingredients-card/burger-ingredients-card'

import { IBurgerIngredientsListSectionProps } from './burger-ingredients-list-section.model'

import styles from './burger-ingredients-list-section.module.css'

const BurgerIngredientsListSection = ({
  className,
  ingredients,
  children,
}: IBurgerIngredientsListSectionProps): JSX.Element => {
  const listClass = classNames(styles.list, className)

  return (
    <div className={listClass}>
      {children}
      {ingredients.map((ingredient) => (
        <BurgerIngredientsCard
          key={ingredient._id}
          className={styles.card}
          ingredient={ingredient}
        />
      ))}
    </div>
  )
}

export default BurgerIngredientsListSection
