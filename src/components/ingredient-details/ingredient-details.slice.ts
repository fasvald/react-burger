/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IBurgerIngredient } from '../../common/models/data.model'
import { RootState } from '../../store'

import { IIngredientDetailsState } from './ingredient-details.model'

const initialState: IIngredientDetailsState = {
  ingredient: null,
}

export const ingredientDetailsSelector = (state: RootState): IBurgerIngredient | null =>
  state.ingredientDetails.ingredient

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
  extraReducers: {},
})

export const { saveIngredientDetails, removeIngredientDetails } = ingredientDetailsSlice.actions

export default ingredientDetailsSlice.reducer
