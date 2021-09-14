import React, { useCallback } from 'react'

import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

import { IIngredientDetailsProps } from './ingredient-details.modal'

import styles from './ingredient-details.module.css'

const IngredientDetails = ({ ingredient, modal }: IIngredientDetailsProps): JSX.Element => {
  const handleClick = useCallback(() => {
    modal.current.close()
  }, [modal])

  const ingredientClass = classNames('text text_type_main-medium', styles.ingredientName)

  return (
    <div className={styles.dialog}>
      <button type='button' onClick={handleClick} className={styles.dialogBtnClose}>
        <CloseIcon type='primary' />
      </button>
      <div className={styles.dialogHeader}>
        <h1 className='text text_type_main-large'>Детали ингредиента</h1>
      </div>
      <div className={styles.dialogBody}>
        <div
          style={{
            backgroundImage: `url(${ingredient.image_large})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            height: '240px',
            width: '100%',
          }}
          className={styles.ingredientImg}
        />
        <p className={ingredientClass}>{ingredient.name}</p>
        <div className={styles.ingredientDetails}>
          <div className={styles.ingredientDetailsItem}>
            <p className='text text_type_main-default text_color_inactive'>Калории,ккал</p>
            <p className='text text_type_digits-default text_color_inactive'>
              {ingredient.calories}
            </p>
          </div>
          <div className={styles.ingredientDetailsItem}>
            <p className='text text_type_main-default text_color_inactive'>Белки, г</p>
            <p className='text text_type_digits-default text_color_inactive'>
              {ingredient.proteins}
            </p>
          </div>
          <div className={styles.ingredientDetailsItem}>
            <p className='text text_type_main-default text_color_inactive'>Жиры, г</p>
            <p className='text text_type_digits-default text_color_inactive'>{ingredient.fat}</p>
          </div>
          <div className={styles.ingredientDetailsItem}>
            <p className='text text_type_main-default text_color_inactive'>Углеводы, г</p>
            <p className='text text_type_digits-default text_color_inactive'>
              {ingredient.carbohydrates}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IngredientDetails
