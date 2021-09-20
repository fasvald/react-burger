import { IBurgerIngredientUnique } from '../../../common/models/data.model'

import { IGroupedIngredients } from './burger-constructor.model'

/**
 * Calculation of total price for all ingredients in burger constructor (can be used outside of component)
 *
 * @param ingredients Passed ingredients to calculate the total price
 * @returns Total price of all ingredients
 */
export function calculateTotalPrice(ingredients: IBurgerIngredientUnique[]): number {
  if (!ingredients || !ingredients.length) {
    return 0
  }

  return ingredients.reduce(
    (sum, ingredient) =>
      // NOTE: API can accept order with sending only one bun ID, so we need to adjust total calculation
      sum + (ingredient.type === 'bun' ? ingredient.price * 2 : ingredient.price),
    0,
  )
}

/**
 * Add ingredient to the "constructor" (basically injection + part of Actions) with checking and
 * normalizing "buns"
 *
 * @param ingredients Root ingredients
 * @param ingredient Added ingredient
 * @returns Newly created array of ingredients with injected new ingredient
 */
export function addIngredient(
  ingredients: IBurgerIngredientUnique[],
  ingredient: IBurgerIngredientUnique,
): IBurgerIngredientUnique[] {
  const newArray = ingredients.slice()

  // NOTE: Omit this check if "bun" will be a first ingredient
  if (ingredient.type === 'bun' && newArray.length) {
    return [...normalizeBuns(newArray, ingredient)]
  }

  return [...newArray, ingredient]
}

/**
 * Remove ingredient from the "constructor" (part of Action)
 *
 * @param ingredients Root ingredients
 * @param ingredient Removed ingredient
 * @returns Newly created "cleared" array of ingredients
 */
export function removeIngredient(
  ingredients: IBurgerIngredientUnique[],
  ingredient: IBurgerIngredientUnique,
): IBurgerIngredientUnique[] {
  const ingredientIndex = ingredients.findIndex((item) => item.nanoid === ingredient.nanoid)

  return ingredients.filter((item, index) => index !== ingredientIndex)
}

/**
 * Group ingredients for constructor for better DX (dev exp)
 *
 * @param ingredients Root ingredients
 * @returns Collection of grouped ingredients by type ("bun" and "toppings" = "main" + "sauce")
 */
export function groupIngredients(ingredients: IBurgerIngredientUnique[]): IGroupedIngredients {
  return ingredients.reduce(
    (groupedIngredients: IGroupedIngredients, ingredient: IBurgerIngredientUnique) => {
      if (ingredient.type === 'bun') {
        groupedIngredients.bun.push(ingredient)
      } else {
        groupedIngredients.toppings.push(ingredient)
      }

      return groupedIngredients
    },
    { bun: [], toppings: [] },
  )
}

/**
 * Normalize buns for constructor (check existence, duplication, etc.)
 *
 * @param ingredients Root ingredients
 * @param ingredient Added ingredient
 * @returns Normalized array of ingredients
 */
function normalizeBuns(
  ingredients: IBurgerIngredientUnique[],
  ingredient: IBurgerIngredientUnique,
): IBurgerIngredientUnique[] {
  // NOTE: Find bun index if it's not a duplication
  const bunIndex = ingredients.findIndex(
    (item) => item.type === 'bun' && item._id !== ingredient._id,
  )

  if (bunIndex !== -1) {
    // NOTE: Remove bun
    const normalizedIngredients = ingredients.filter((item, i) => i !== bunIndex)

    // NOTE: Insert a new bun instead of an old one
    normalizedIngredients.splice(bunIndex, 0, ingredient)

    return normalizedIngredients
  }

  return ingredients
}
