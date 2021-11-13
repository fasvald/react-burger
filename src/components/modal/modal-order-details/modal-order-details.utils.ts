/* eslint-disable import/prefer-default-export */

import { IOrder } from '@common/models/orders.model'
import {
  IBurgerIngredient,
  IBurgerIngredientCount,
} from '@components/burger-ingredients/burger-ingredients.model'

/**
 * Get (normalize) ingredients from order for order details card with duplication removal and it's count
 *
 * @param ingredients Burger ingredients
 * @param orderIngredients Burger ingredients in order
 * @returns Normalized collection of burger ingredients in order
 */
export const getUniqueIngredientsForOrder = (
  ingredients: IBurgerIngredient[],
  // https://twitter.com/kentcdodds/status/1458273770477604868?s=20 (o_O)
  orderIngredients: IOrder['ingredients'],
): IBurgerIngredientCount[] => {
  const ingredientsInfo = orderIngredients.reduce(
    (
      acc: {
        count: Record<string, number>
        ingredients: IBurgerIngredient[]
      },
      curr: string,
    ) => {
      // Push unique ingredient
      if (!acc.count[curr]) {
        acc.ingredients.push(
          ingredients.find((ingredient) => ingredient._id === curr) as IBurgerIngredient,
        )
      }

      // Count of ingredient "repetitions"
      acc.count[curr] = (acc.count[curr] || 0) + 1

      return acc
    },
    { count: {}, ingredients: [] },
  )

  // Normalize ingredients for list with number of "repetitions" (+ remembering if it's a bun => x2)
  return ingredientsInfo.ingredients.map((ingredient) => ({
    ...ingredient,
    count: ingredient.name.toLowerCase().includes('булка')
      ? 2
      : ingredientsInfo.count[ingredient._id],
  }))
}
