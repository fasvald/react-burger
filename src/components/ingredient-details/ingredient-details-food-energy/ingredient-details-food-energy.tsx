import React from 'react'

import classNames from 'classnames'

import { IIngredientDetailsFoodEnergyProps } from './ingredient-details-food-energy.model'

import styles from './ingredient-details-food-energy.module.css'

const IngredientDetailsFoodEnergy = ({
  className,
  foodEnergy,
}: IIngredientDetailsFoodEnergyProps): JSX.Element => {
  const foodEnergyWrapperClass = classNames(styles.list, className)

  return (
    <div className={foodEnergyWrapperClass}>
      {foodEnergy?.calories && (
        <div className={styles.listItem}>
          <p className='text text_type_main-default text_color_inactive'>Калории,ккал</p>
          <p className='text text_type_digits-default text_color_inactive'>{foodEnergy.calories}</p>
        </div>
      )}
      {foodEnergy?.proteins && (
        <div className={styles.listItem}>
          <p className='text text_type_main-default text_color_inactive'>Белки, г</p>
          <p className='text text_type_digits-default text_color_inactive'>{foodEnergy.proteins}</p>
        </div>
      )}
      {foodEnergy?.fat && (
        <div className={styles.listItem}>
          <p className='text text_type_main-default text_color_inactive'>Жиры, г</p>
          <p className='text text_type_digits-default text_color_inactive'>{foodEnergy.fat}</p>
        </div>
      )}
      {foodEnergy?.carbohydrates && (
        <div className={styles.listItem}>
          <p className='text text_type_main-default text_color_inactive'>Углеводы, г</p>
          <p className='text text_type_digits-default text_color_inactive'>
            {foodEnergy.carbohydrates}
          </p>
        </div>
      )}
    </div>
  )
}

export default React.memo(IngredientDetailsFoodEnergy)
