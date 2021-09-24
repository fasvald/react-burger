import { createSelector, PayloadAction } from '@reduxjs/toolkit'
import produce from 'immer'
import { nanoid } from 'nanoid'
import { AnyAction } from 'redux'

import { IBurgerIngredient, IBurgerIngredientUnique } from '../../common/models/data.model'
import { AppThunk, RootState } from '../../store'

import { IBurgerConstructorIngredientState } from './burger-constructor.model'
import { calculateTotalPrice } from './burger-constructor.utils'

/** Actions */

enum ActionKind {
  AddBun = 'burgerConstructor/addBun',
  ReplaceBun = 'burgerConstructor/replaceBun',
  AddTopping = 'burgerConstructor/addTopping',
  RemoveTopping = 'burgerConstructor/removeTopping',
}

/** Initial state */

export const initialState: IBurgerConstructorIngredientState = {
  buns: [],
  toppings: [],
}

/** Selectors */

export const burgerConstructorSelector = (state: RootState): IBurgerConstructorIngredientState =>
  state.burgerConstructor

export const burgerConstructorBunSelector = (state: RootState): IBurgerIngredientUnique[] =>
  state.burgerConstructor.buns

export const burgerConstructorToppingsSelector = (state: RootState): IBurgerIngredientUnique[] =>
  state.burgerConstructor.toppings

export const selectBurgerConstructorTotalPrice = createSelector(
  [burgerConstructorSelector],
  (constructor) => calculateTotalPrice([...constructor.buns, ...constructor.toppings]),
)

/** Action creators */

const getBunIngredientPayload = (bunIngredient: IBurgerIngredient) => ({
  ingredient: {
    ...bunIngredient,
    nanoid: nanoid(),
  },
})

export const bunIngredientAdd = (
  bunIngredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.AddBun> => ({
  type: ActionKind.AddBun,
  payload: getBunIngredientPayload(bunIngredient),
})

export const bunIngredientReplace = (
  bunIngredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.ReplaceBun> => ({
  type: ActionKind.ReplaceBun,
  payload: getBunIngredientPayload(bunIngredient),
})

export const toppingIngredientAdd = (
  toppingIngredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.AddTopping> => ({
  type: ActionKind.AddTopping,
  payload: getBunIngredientPayload(toppingIngredient),
})

export const bunIngredientAddThunk =
  (ingredient: IBurgerIngredient): AppThunk =>
  (dispatch, getState) => {
    const {
      burgerConstructor: { buns },
    } = getState()

    if (buns.length && buns[0]._id !== ingredient._id) {
      dispatch(bunIngredientReplace(ingredient))
    }

    if (!buns.length) {
      dispatch(bunIngredientAdd(ingredient))
    }
  }

/** Reducer */

export const burgerConstructorReducer = produce((draft, action: AnyAction) => {
  const { type, payload } = action as PayloadAction<{ ingredient: IBurgerIngredientUnique }>

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
      return draft
    }
    default:
      return draft
  }
}, initialState)
