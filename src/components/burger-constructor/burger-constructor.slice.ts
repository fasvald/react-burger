/* eslint-disable no-param-reassign */

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { nanoid } from 'nanoid'

import { RootState } from '@store'

import {
  IBurgerIngredient,
  IBurgerIngredientUnique,
} from '../burger-ingredients/burger-ingredients.model'

import { IBurgerConstructorIngredientState } from './burger-constructor.model'
import calculateTotalPrice from './burger-constructor.utils'

const initialState: IBurgerConstructorIngredientState = {
  buns: [],
  toppings: [],
}

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

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: {
      reducer: (state, action: PayloadAction<IBurgerIngredientUnique>) => {
        const { buns } = state

        if (buns.length && buns[0]._id !== action.payload._id) {
          state.buns.pop()
          state.buns.push(action.payload)
        }

        if (!buns.length) {
          state.buns.push(action.payload)
        }
      },
      prepare: (ingredient: IBurgerIngredient) => {
        const id = nanoid()

        return { payload: { ...ingredient, nanoid: id } }
      },
    },
    addTopping: {
      reducer: (state, action: PayloadAction<IBurgerIngredientUnique>) => {
        state.toppings.push(action.payload)
      },
      prepare: (ingredient: IBurgerIngredient) => {
        const id = nanoid()

        return { payload: { ...ingredient, nanoid: id } }
      },
    },
    removeTopping: (state, action: PayloadAction<IBurgerIngredientUnique>) => {
      const index = state.toppings.findIndex((topping) => topping.nanoid === action.payload.nanoid)

      if (index !== -1) state.toppings.splice(index, 1)
    },
    swapTopping: (state, action: PayloadAction<{ toIndex: number; fromIndex: number }>) => {
      state.toppings.splice(
        action.payload.toIndex,
        0,
        state.toppings.splice(action.payload.fromIndex, 1)[0],
      )
    },
    clearIngredients: (state) => {
      state.buns = []
      state.toppings = []
    },
  },
})

export const { addBun, addTopping, removeTopping, swapTopping, clearIngredients } =
  burgerConstructorSlice.actions

export default burgerConstructorSlice.reducer
