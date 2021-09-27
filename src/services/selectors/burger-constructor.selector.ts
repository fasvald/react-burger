import { createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'

import { IBurgerIngredientUnique } from '../../common/models/data.model'
import { IBurgerConstructorIngredientState } from '../../components/burger-constructor/burger-constructor.model'
import calculateTotalPrice from '../../components/burger-constructor/burger-constructor.utils'
import { RootState } from '../../store'

export const burgerConstructorSelector = (state: RootState): IBurgerConstructorIngredientState =>
  state.burgerConstructor

export const bunsSelector = (state: RootState): IBurgerIngredientUnique[] =>
  state.burgerConstructor.buns

export const toppingsSelector = (state: RootState): IBurgerIngredientUnique[] =>
  state.burgerConstructor.toppings

export const selectIngredientsTotalPrice = createSelector(
  [burgerConstructorSelector],
  (constructor) =>
    memoize(() => calculateTotalPrice([...constructor.buns, ...constructor.toppings])),
)

export const selectIngredientsID = createSelector([burgerConstructorSelector], (constructor) =>
  memoize(() => [...constructor.buns, ...constructor.toppings].map((ingredient) => ingredient._id)),
)

export const selectIngredientIterationByID = createSelector(
  [burgerConstructorSelector],
  (constructor) =>
    memoize((id: string) =>
      [...constructor.buns, ...constructor.toppings].reduce((countValue, ingredient) => {
        if (ingredient._id === id) {
          return countValue + 1
        }

        return countValue
      }, 0),
    ),
)
