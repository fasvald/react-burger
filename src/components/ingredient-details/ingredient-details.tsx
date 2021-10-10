import React, { useEffect, useMemo } from 'react'

import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { useAppSelector } from '../../hooks'
import { IBurgerIngredient } from '../burger-ingredients/burger-ingredients.model'
import { ingredientsSelector } from '../burger-ingredients/burger-ingredients.slice'

import IngredientDetailsFoodEnergy from './ingredient-details-food-energy/ingredient-details-food-energy'
import IngredientDetailsImage from './ingredient-details-image/ingredient-details-image'
import {
  ingredientDetailsSelector,
  removeIngredientDetails,
  selectIngredientFoodEnergy,
} from './ingredient-details.slice'

import styles from './ingredient-details.module.css'

interface IIngredientDetailsProps {
  isFullSizePage?: boolean
}

const IngredientDetails = ({ isFullSizePage = false }: IIngredientDetailsProps): JSX.Element => {
  const ingredients = useAppSelector(ingredientsSelector)

  const ingredient = useAppSelector(ingredientDetailsSelector)
  const foodEnergy = useAppSelector((state) => selectIngredientFoodEnergy(state)())

  const { id } = useParams<{ id: string }>()

  const dispatch = useDispatch()

  const ingredientNameClass = useMemo(
    () => classNames('text text_type_main-medium', styles.ingredientName),
    [],
  )

  useEffect(() => {
    // IT's kinda hack because previously we pass custom callback on modal close prop, but right now it's a modal route
    // so we will be sure that when modal will be closed and this component will be destroyed it will clear store...
    // either we try to create some smart event logic via https://www.falldowngoboone.com/blog/talk-to-your-react-components-with-custom-events/
    return () => {
      dispatch(removeIngredientDetails())
    }
  }, [dispatch])

  if (!ingredient) {
    return (
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h1 className='text text_type_main-large'>Детали ингредиента</h1>
        </div>
        <div className={styles.dialogBody}>
          <p>!!! NOPE for {id} !!!</p>
        </div>
      </div>
    )
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
