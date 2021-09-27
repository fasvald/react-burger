import { PayloadAction } from '@reduxjs/toolkit'
import { Action } from 'redux'

import { IBurgerIngredient } from '../../common/models/data.model'

export enum ActionKind {
  Save = 'ingredientDetails/save',
  Remove = 'ingredientDetails/remove',
}

export const saveIngredientDetails = (
  ingredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredient }, ActionKind.Save> => ({
  type: ActionKind.Save,
  payload: { ingredient },
})

export const removeIngredientDetails = (): Action<ActionKind.Remove> => ({
  type: ActionKind.Remove,
})
