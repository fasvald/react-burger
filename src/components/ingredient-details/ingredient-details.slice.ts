/* eslint-disable no-param-reassign */

import { createSelector, PayloadAction } from '@reduxjs/toolkit'
import produce from 'immer'
import { Action, AnyAction } from 'redux'

import { IBurgerIngredient } from '../../common/models/data.model'
import { RootState } from '../../store'

import { IIngredientDetailsState } from './ingredient-details.model'

/** Actions */

enum ActionKind {
  Save = 'ingredientDetails/save',
  Remove = 'ingredientDetails/remove',
}

/** Initial state */

const initialState: IIngredientDetailsState = {
  ingredient: null,
}

/** Selectors */

const ingredientDetailsSelector = (state: RootState) => state.ingredientDetails.ingredient

export const selectIngredientDetails = createSelector(
  [ingredientDetailsSelector],
  (ingredientDetails) => ingredientDetails,
)

/** Action creators */

export const ingredientDetailsSave = (
  ingredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredient }, ActionKind.Save> => ({
  type: ActionKind.Save,
  payload: { ingredient },
})

export const ingredientDetailsRemove = (): Action<ActionKind.Remove> => ({
  type: ActionKind.Remove,
})

/** Reducer */

export const ingredientDetailsReducer = produce((draft, action: AnyAction) => {
  const { type, payload } = action

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
