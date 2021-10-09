/* eslint-disable no-param-reassign */

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { memoize, pick } from 'lodash'

import { IBurgerIngredient, IBurgerIngredientFoodEnergy } from '../../common/models/data.model'
import { RootState } from '../../store'

interface IIngredientDetailsState {
  ingredient: IBurgerIngredient | null
}

const initialState: IIngredientDetailsState = {
  ingredient: null,
}

export const ingredientDetailsSelector = (state: RootState): IBurgerIngredient | null =>
  state.ingredientDetails.ingredient

export const selectIngredientFoodEnergy = createSelector(
  [ingredientDetailsSelector],
  (constructor) =>
    memoize(() =>
      pick<IBurgerIngredientFoodEnergy>(constructor, [
        'calories',
        'proteins',
        'fat',
        'carbohydrates',
      ]),
    ),
)

const ingredientDetailsSlice = createSlice({
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

export const { saveIngredientDetails, removeIngredientDetails } = ingredientDetailsSlice.actions

export default ingredientDetailsSlice.reducer
