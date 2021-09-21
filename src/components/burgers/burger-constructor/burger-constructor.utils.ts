import { useState } from 'react'

import { IBurgerIngredientUnique, TFetchProcess } from '../../../common/models/data.model'
import { ORDER_CREATION_API_ENDPOINT } from '../../app/app.constant'
import {
  IOrderDetails,
  IOrderDetailsBody,
  IUseOrderDetails,
} from '../../order-details/order-details.model'

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
      // API can accept order with sending only one bun ID, so we need to adjust total calculation
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

  // Omit this check if "bun" will be a first ingredient
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
export function normalizeBuns(
  ingredients: IBurgerIngredientUnique[],
  ingredient: IBurgerIngredientUnique,
): IBurgerIngredientUnique[] {
  // Find bun index if it's not a duplication
  const bunIndex = ingredients.findIndex((item) => item.type === 'bun')

  // No buns at all, so we insert a bun into the first position
  if (bunIndex === -1) {
    ingredients.splice(0, 0, ingredient)
  }

  // We have found a bun, so we need to check if it duplication and replace it
  if (bunIndex !== -1 && ingredients[bunIndex]._id !== ingredient._id) {
    ingredients.splice(bunIndex, 1) // Remove bun
    ingredients.splice(bunIndex, 0, ingredient) // Add bun
  }

  return ingredients
}

export function useOrderDetails(): IUseOrderDetails {
  const [status, setStatus] = useState<TFetchProcess>('idle')
  const [order, setOrder] = useState<IOrderDetails | null>(null)

  const controller = new AbortController()
  const { signal } = controller

  const createOrder = async (body: IOrderDetailsBody, cb: () => void) => {
    setStatus('loading')

    try {
      const response = await fetch(ORDER_CREATION_API_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal,
      })

      const result = await response.json()

      setStatus('loaded')
      setOrder(result)
      cb()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)

      setStatus('error')
      setOrder(null)
    }
  }

  return { order, status, controller, createOrder }
}
