import React, { useMemo } from 'react'

import { IBurgerIngredientUnique } from '@components/burger-ingredients/burger-ingredients.model'

import styles from './order-card-img-row.module.css'

interface IOrderCardImgRowProps {
  ingredients: IBurgerIngredientUnique[]
}

const MAX_IMAGES_IN_ROW = 6

const OrderCardImgRow = ({ ingredients }: IOrderCardImgRowProps): JSX.Element => {
  const ingredientsChunk = useMemo(() => ingredients.slice(0, MAX_IMAGES_IN_ROW), [ingredients])

  return (
    <div className={styles.wrapper}>
      {ingredientsChunk.map((ingredient, i) => (
        <div className={styles.ingredientAvatar}>
          <img
            src={ingredient.image}
            style={{
              opacity:
                ingredients.length > MAX_IMAGES_IN_ROW && i === MAX_IMAGES_IN_ROW - 1 ? 0.6 : 1,
            }}
            alt='Ingredient Avatar'
          />
          {ingredients.length > 6 && i === MAX_IMAGES_IN_ROW - 1 && (
            <div className={styles.ingredientAvatarRest}>
              <p className='text text_type_digits-default'>
                +{ingredients.length - MAX_IMAGES_IN_ROW}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default React.memo(OrderCardImgRow)
