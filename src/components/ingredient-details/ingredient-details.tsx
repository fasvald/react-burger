import React, { useEffect, useMemo } from 'react'

import { Skeleton } from '@mui/material'
import classNames from 'classnames'
import { pick } from 'lodash'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { useAppSelector } from '@hooks'

import { IBurgerIngredientFoodEnergy } from '../burger-ingredients/burger-ingredients.model'
import { ingredientsFetchStatusSelector } from '../burger-ingredients/burger-ingredients.slice'

import IngredientDetailsFoodEnergy from './ingredient-details-food-energy/ingredient-details-food-energy'
import IngredientDetailsImage from './ingredient-details-image/ingredient-details-image'
import { removeIngredientDetails, selectChosenIngredient } from './ingredient-details.slice'

import styles from './ingredient-details.module.css'

interface IIngredientDetailsProps {
  isFullSizePage?: boolean
}

const FOOD_ENERGY_PROPS = ['calories', 'proteins', 'fat', 'carbohydrates']

const IngredientDetails = ({ isFullSizePage = false }: IIngredientDetailsProps): JSX.Element => {
  const { id } = useParams()

  const ingredient = useAppSelector((state) => selectChosenIngredient(state)(id))
  const ingredientFetchStatus = useAppSelector(ingredientsFetchStatusSelector)

  const foodEnergy = pick<IBurgerIngredientFoodEnergy>(ingredient, FOOD_ENERGY_PROPS)

  const dispatch = useDispatch()

  const dialogWrapperClass = useMemo(
    () => classNames(styles.dialog, isFullSizePage ? styles.dialog_fullSize : ''),
    [isFullSizePage],
  )

  const ingredientNameClass = useMemo(
    () => classNames('text text_type_main-medium', styles.ingredientName),
    [],
  )

  const dialogBodyClass = useMemo(
    () => classNames(styles.dialogBody, ingredient ? '' : styles.dialogBody_skeleton),
    [ingredient],
  )

  useEffect(() => {
    // IT's kinda hack because previously we pass custom callback on modal close prop, but right now it's a modal route
    // so we will be sure that when modal will be closed and this component will be destroyed it will clear store...
    // either we try to create some smart event logic via https://www.falldowngoboone.com/blog/talk-to-your-react-components-with-custom-events/
    return () => {
      dispatch(removeIngredientDetails())
    }
  }, [dispatch, ingredientFetchStatus, isFullSizePage])

  return (
    <div className={dialogWrapperClass}>
      <div className={styles.dialogHeader}>
        <h1 className='text text_type_main-large'>
          {ingredientFetchStatus !== 'loading' && !ingredient
            ? 'Детали ингредиента были не найдены'
            : 'Детали ингредиента'}
        </h1>
      </div>
      <div className={dialogBodyClass}>
        {ingredientFetchStatus === 'loading' || !ingredient ? (
          <Skeleton variant='circular' width={180} height={180} sx={{ bgcolor: '#8585ad' }} />
        ) : (
          <IngredientDetailsImage image={ingredient.image_large} height='240px' />
        )}
        {ingredientFetchStatus === 'loading' || !ingredient ? (
          <Skeleton
            variant='text'
            width='100%'
            height={50}
            sx={{ bgcolor: '#8585ad', marginTop: '16px' }}
          />
        ) : (
          <p className={ingredientNameClass}>{ingredient.name}</p>
        )}
        {ingredientFetchStatus === 'loading' || !ingredient ? (
          <Skeleton
            variant='rectangular'
            width='100%'
            height={60}
            sx={{ bgcolor: '#8585ad', marginTop: '32px', marginBottom: '20px' }}
          />
        ) : (
          <IngredientDetailsFoodEnergy className={styles.foodEnergyInfo} foodEnergy={foodEnergy} />
        )}
      </div>
    </div>
  )
}

export default React.memo(IngredientDetails)
