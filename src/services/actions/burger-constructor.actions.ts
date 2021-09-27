import { Action, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

import { IBurgerIngredient, IBurgerIngredientUnique } from '../../common/models/data.model'
import { AppThunk } from '../../store'

export enum ActionKind {
  AddBun = 'burgerConstructor/addBun',
  ReplaceBun = 'burgerConstructor/replaceBun',
  AddTopping = 'burgerConstructor/addTopping',
  RemoveTopping = 'burgerConstructor/removeTopping',
  SwapTopping = 'burgerConstructor/swapTopping',
  ClearIngredients = 'burgerConstructor/clearIngredients',
}

const getUniqueIngredientPayload = (ingredient: IBurgerIngredient) => ({
  ingredient: {
    ...ingredient,
    nanoid: nanoid(),
  },
})

const addBun = (
  ingredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.AddBun> => ({
  type: ActionKind.AddBun,
  payload: getUniqueIngredientPayload(ingredient),
})

const replaceBun = (
  ingredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.ReplaceBun> => ({
  type: ActionKind.ReplaceBun,
  payload: getUniqueIngredientPayload(ingredient),
})

export const addBunWithReplacement =
  (ingredient: IBurgerIngredient): AppThunk =>
  (dispatch, getState) => {
    const {
      burgerConstructor: { buns },
    } = getState()

    if (buns.length && buns[0]._id !== ingredient._id) {
      dispatch(replaceBun(ingredient))
    }

    if (!buns.length) {
      dispatch(addBun(ingredient))
    }
  }

export const addTopping = (
  ingredient: IBurgerIngredient,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.AddTopping> => ({
  type: ActionKind.AddTopping,
  payload: getUniqueIngredientPayload(ingredient),
})

export const removeTopping = (
  ingredient: IBurgerIngredientUnique,
): PayloadAction<{ ingredient: IBurgerIngredientUnique }, ActionKind.RemoveTopping> => ({
  type: ActionKind.RemoveTopping,
  payload: {
    ingredient,
  },
})

export const swapTopping = (
  toIndex: number,
  fromIndex: number,
): PayloadAction<{ toIndex: number; fromIndex: number }, ActionKind.SwapTopping> => ({
  type: ActionKind.SwapTopping,
  payload: {
    toIndex,
    fromIndex,
  },
})

export const clearIngredients = (): Action<ActionKind.ClearIngredients> => ({
  type: ActionKind.ClearIngredients,
})
