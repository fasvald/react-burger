import React, { useCallback } from 'react'

import { IIngredientDetailsProps } from './ingredient-details.modal'

import styles from './ingredient-details.module.css'

const IngredientDetails = ({ ingredient, modal }: IIngredientDetailsProps): JSX.Element => {
  const handleClick = useCallback(() => {
    modal.current.close()
  }, [modal])

  return (
    <div className={styles.wrapper}>
      <h1>Детали ингредиента</h1>
      <button type='button' onClick={handleClick}>
        Close
      </button>
      <img src={ingredient.image_large} alt='Фото ингридента' />
      <p>{ingredient.name}</p>
      <p>{ingredient.calories}</p>
      <p>{ingredient.proteins}</p>
      <p>{ingredient.fat}</p>
      <p>{ingredient.carbohydrates}</p>
    </div>
  )
}

export default IngredientDetails
