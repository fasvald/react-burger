import React, { useMemo } from 'react'

import classNames from 'classnames'
import { useParams } from 'react-router-dom'

import { useAppSelector } from '../../hooks'
import { IBurgerIngredient } from '../burger-ingredients/burger-ingredients.model'

import IngredientDetailsFoodEnergy from './ingredient-details-food-energy/ingredient-details-food-energy'
import IngredientDetailsImage from './ingredient-details-image/ingredient-details-image'
import { selectIngredientFoodEnergy } from './ingredient-details.slice'

import styles from './ingredient-details.module.css'

interface IIngredientDetailsProps {
  ingredient?: IBurgerIngredient | null
}

const IngredientDetails = ({ ingredient }: IIngredientDetailsProps): JSX.Element => {
  const foodEnergy = useAppSelector((state) => selectIngredientFoodEnergy(state)())

  const { id } = useParams<{ id: string }>()

  const ingredientNameClass = useMemo(
    () => classNames('text text_type_main-medium', styles.ingredientName),
    [],
  )

  if (!foodEnergy || !ingredient) {
    return <div className={styles.dialog}>NO DATA FOR INGREDIENT {id}</div>
  }

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
