import React, { useMemo } from 'react'

import classNames from 'classnames'

import { IBurgerIngredient } from '../../common/models/data.model'
import { useAppSelector } from '../../hooks'

import IngredientDetailsFoodEnergy from './ingredient-details-food-energy/ingredient-details-food-energy'
import IngredientDetailsImage from './ingredient-details-image/ingredient-details-image'
import { selectIngredientFoodEnergy } from './ingredient-details.slice'

import styles from './ingredient-details.module.css'

interface IIngredientDetailsProps {
  ingredient: IBurgerIngredient
}

const IngredientDetails = ({ ingredient }: IIngredientDetailsProps): JSX.Element => {
  const foodEnergy = useAppSelector((state) => selectIngredientFoodEnergy(state)())

  const ingredientNameClass = useMemo(
    () => classNames('text text_type_main-medium', styles.ingredientName),
    [],
  )

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

export default React.memo(IngredientDetails)
