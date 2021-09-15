import React from 'react'

import classNames from 'classnames'
import { pick } from 'lodash'

import { IBurgerIngredientFoodEnergy } from '../../common/models/data.model'

import IngredientDetailsFoodEnergy from './ingredient-details-food-energy/ingredient-details-food-energy'
import IngredientDetailsImage from './ingredient-details-image/ingredient-details-image'
import { IIngredientDetailsProps } from './ingredient-details.model'

import styles from './ingredient-details.module.css'

const IngredientDetails = ({ ingredient }: IIngredientDetailsProps): JSX.Element => {
  const ingredientNameClass = classNames('text text_type_main-medium', styles.ingredientName)

  const foodEnergy = pick<IBurgerIngredientFoodEnergy>(ingredient, [
    'calories',
    'proteins',
    'fat',
    'carbohydrates',
  ])

  return (
    <div className={styles.dialog}>
      <div className={styles.dialogHeader}>
        <h1 className='text text_type_main-large'>Детали ингредиента</h1>
      </div>
      <div className={styles.dialogBody}>
        <IngredientDetailsImage image={ingredient.image_large} height='240px' />
        <p className={ingredientNameClass}>{ingredient.name}</p>
        <IngredientDetailsFoodEnergy className={styles.foodEnergyInfo} foodEnergy={foodEnergy} />
      </div>
    </div>
  )
}

export default IngredientDetails
