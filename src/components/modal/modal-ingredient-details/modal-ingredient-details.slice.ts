/* eslint-disable no-param-reassign */

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { memoize } from 'lodash'

import { RootState } from '@store'

import { IBurgerIngredient } from '../../burger-ingredients/burger-ingredients.model'
import { ingredientsSelector } from '../../burger-ingredients/burger-ingredients.slice'

export interface IIngredientDetailsState {
  ingredient: IBurgerIngredient | null
}

const initialState: IIngredientDetailsState = {
  ingredient: null,
}

export const chosenIngredientDetailsSelector = (state: RootState): IBurgerIngredient | null =>
  state.ingredientDetails.ingredient

// It will pick either chosen ingredient if it in the store (when user clicks on ingredient card)
// or try to find among all ingredients by ID (in case when user reload the page and chosen by click disappeared)
export const selectChosenIngredient = createSelector(
  [chosenIngredientDetailsSelector, ingredientsSelector],
  (chosenIngredient, ingredients) =>
    memoize(
      (id?: string) => chosenIngredient || ingredients.find((ingredient) => ingredient._id === id),
    ),
)

const modalIngredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    saveIngredientDetails: (state, action: PayloadAction<IBurgerIngredient>) => {
      state.ingredient = action.payload
    },
    removeIngredientDetails: (state) => {
      state.ingredient = null
    },
  },
})

export const { saveIngredientDetails, removeIngredientDetails } =
  modalIngredientDetailsSlice.actions

export default modalIngredientDetailsSlice.reducer
