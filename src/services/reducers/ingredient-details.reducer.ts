/* eslint-disable no-param-reassign */

import { PayloadAction } from '@reduxjs/toolkit'
import produce from 'immer'
import { AnyAction } from 'redux'

import { IBurgerIngredient } from '../../common/models/data.model'
import { IIngredientDetailsState } from '../../components/ingredient-details/ingredient-details.model'
import { ActionKind } from '../actions/ingredient-details.actions'

const initialState: IIngredientDetailsState = {
  ingredient: null,
}

const ingredientDetailsReducer = produce((draft, action: AnyAction) => {
  const { type, payload } = action as PayloadAction<{ ingredient: IBurgerIngredient | null }>

  switch (type) {
    case ActionKind.Save: {
      draft.ingredient = payload.ingredient

      return draft
    }
    case ActionKind.Remove: {
      draft.ingredient = null

      return draft
    }
    default:
      return draft
  }
}, initialState)

export default ingredientDetailsReducer
