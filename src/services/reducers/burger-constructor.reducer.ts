/* eslint-disable no-param-reassign */

import { PayloadAction } from '@reduxjs/toolkit'
import produce from 'immer'
import { AnyAction } from 'redux'

import { IBurgerIngredientUnique } from '../../common/models/data.model'
import { IBurgerConstructorIngredientState } from '../../components/burger-constructor/burger-constructor.model'
import { ActionKind } from '../actions/burger-constructor.actions'

const initialState: IBurgerConstructorIngredientState = {
  buns: [],
  toppings: [],
}

const burgerConstructorReducer = produce((draft, action: AnyAction) => {
  const { type, payload } = action as PayloadAction<{
    ingredient: IBurgerIngredientUnique
    toIndex: number
    fromIndex: number
  }>

  switch (type) {
    case ActionKind.AddBun: {
      draft.buns.push(payload.ingredient)

      return draft
    }
    case ActionKind.ReplaceBun: {
      draft.buns.pop()
      draft.buns.push(payload.ingredient)

      return draft
    }
    case ActionKind.AddTopping: {
      draft.toppings.push(payload.ingredient)

      return draft
    }
    case ActionKind.RemoveTopping: {
      const index = draft.toppings.findIndex(
        (topping) => topping.nanoid === payload.ingredient.nanoid,
      )

      if (index !== -1) draft.toppings.splice(index, 1)

      return draft
    }
    case ActionKind.SwapTopping: {
      draft.toppings.splice(payload.toIndex, 0, draft.toppings.splice(payload.fromIndex, 1)[0])

      return draft
    }
    case ActionKind.ClearIngredients: {
      draft.buns = []
      draft.toppings = []

      return draft
    }
    default:
      return draft
  }
}, initialState)

export default burgerConstructorReducer
