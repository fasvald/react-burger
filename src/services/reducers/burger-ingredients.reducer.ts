/* eslint-disable no-param-reassign */

import { AnyAction, PayloadAction } from '@reduxjs/toolkit'
import produce from 'immer'

import { IBurgerIngredient, TFetchProcess } from '../../common/models/data.model'
import { IBurgerIngredientsState } from '../../components/burger-ingredients/burger-ingredients.model'
import { ActionKind } from '../actions/burger-ingredients.actions'

/** Initial state */

const initialState: IBurgerIngredientsState = {
  status: 'idle',
  items: [],
}

const burgerIngredientsReducer = produce((draft, action: AnyAction) => {
  const { type, payload } = action as PayloadAction<{
    status: TFetchProcess
    items: IBurgerIngredient[]
  }>

  switch (type) {
    case ActionKind.Pending: {
      draft.status = payload.status

      return draft
    }
    case ActionKind.Fulfilled: {
      draft.items = payload.items
      draft.status = payload.status

      return draft
    }
    case ActionKind.Rejected: {
      draft.items = []
      draft.status = payload.status

      return draft
    }
    default:
      return draft
  }
}, initialState)

export default burgerIngredientsReducer
