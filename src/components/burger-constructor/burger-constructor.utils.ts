import { IBurgerIngredientUnique } from '../burger-ingredients/burger-ingredients.model'

/**
 * Calculation of total price for all ingredients in burger constructor (can be used outside of component)
 *
 * @param ingredients Passed ingredients to calculate the total price
 * @returns Total price of all ingredients
 */
const calculateTotalPrice = (ingredients: IBurgerIngredientUnique[]): number => {
  if (!ingredients || !ingredients.length) {
    return 0
  }

  return ingredients.reduce(
    (sum, ingredient) =>
      // API can accept order with sending only one bun ID, so we need to adjust total calculation
      sum + (ingredient.type === 'bun' ? ingredient.price * 2 : ingredient.price),
    0,
  )
}

export default calculateTotalPrice
