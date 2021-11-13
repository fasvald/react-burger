import React, { useMemo } from 'react'

import { IBurgerIngredientUnique } from '@components/burger-ingredients/burger-ingredients.model'
import IngredientAvatar from '@components/ingredient-avatar/ingredient-avatar'
import IngredientAvatarOverlay from '@components/ingredient-avatar/ingredient-avatar-overlay/ingredient-avatar-overlay'

import styles from './card-order-ingredients-row.module.css'

interface ICardOrderIngredientsRowProps {
  ingredients: IBurgerIngredientUnique[]
}

const MAX_ITEMS_IN_ROW = 6

const CardOrderIngredientsRow = ({ ingredients }: ICardOrderIngredientsRowProps): JSX.Element => {
  const ingredientsChunk = useMemo(() => ingredients.slice(0, MAX_ITEMS_IN_ROW), [ingredients])

  return (
    <div className={styles.wrapper}>
      {ingredientsChunk.map((ingredient, i) => (
        <IngredientAvatar
          key={ingredient.nanoid}
          className={styles.ingredientAvatar}
          style={{
            width: 64,
            height: 64,
            opacity: ingredients.length > MAX_ITEMS_IN_ROW && i === MAX_ITEMS_IN_ROW - 1 ? 0.6 : 1,
          }}
          imageSrc={ingredient.image}
          overlay={
            ingredients.length > 6 &&
            i === MAX_ITEMS_IN_ROW - 1 && (
              <IngredientAvatarOverlay content={`+${ingredients.length - MAX_ITEMS_IN_ROW}`} />
            )
          }
        />
      ))}
    </div>
  )
}

export default React.memo(CardOrderIngredientsRow)
