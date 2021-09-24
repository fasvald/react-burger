import { createSelector, PayloadAction } from '@reduxjs/toolkit'
import produce from 'immer'
import { memoize } from 'lodash'
import { nanoid } from 'nanoid'
import { AnyAction } from 'redux'

import { IBurgerIngredient, IBurgerIngredientUnique } from '../../common/models/data.model'
import { AppThunk, RootState } from '../../store'

import { IBurgerConstructorIngredientState } from './burger-constructor.model'
import calculateTotalPrice from './burger-constructor.utils'

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
  (constructor) =>
    memoize(() => calculateTotalPrice([...constructor.buns, ...constructor.toppings])),
)

export const selectBurgerConstructorIDs = createSelector(
  [burgerConstructorSelector],
  (constructor) =>
    memoize(() =>
      [...constructor.buns, ...constructor.toppings].map((ingredient) => ingredient._id),
    ),
)

export const selectBurgerConstructorIngredientCountById = createSelector(
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

/** Action creators */

const getIngredientInsertingPayload = (ingredient: IBurgerIngredient) => ({
  ingredient: {
    ...ingredient,
    nanoid: nanoid(),
  },
})

export const bunIngredientAdd = (
  ingredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.AddBun> => ({
  type: ActionKind.AddBun,
  payload: getIngredientInsertingPayload(ingredient),
})

export const bunIngredientReplace = (
  ingredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.ReplaceBun> => ({
  type: ActionKind.ReplaceBun,
  payload: getIngredientInsertingPayload(ingredient),
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

export const toppingIngredientAdd = (
  ingredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.AddTopping> => ({
  type: ActionKind.AddTopping,
  payload: getIngredientInsertingPayload(ingredient),
})

export const toppingIngredientRemove = (
  ingredient: IBurgerIngredientUnique,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.RemoveTopping> => ({
  type: ActionKind.RemoveTopping,
  payload: {
    ingredient,
  },
})

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
      const index = draft.toppings.findIndex(
        (topping) => topping.nanoid === payload.ingredient.nanoid,
      )

      if (index !== -1) draft.toppings.splice(index, 1)

      return draft
    }
    default:
      return draft
  }
}, initialState)
