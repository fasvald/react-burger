/* eslint-disable no-param-reassign */

import { AnyAction, createSelector, PayloadAction } from '@reduxjs/toolkit'
import produce from 'immer'
import { memoize } from 'lodash'

import {
  IBurgerIngredient,
  IBurgerIngredientFetch,
  TBurgerIngredientType,
  TFetchProcess,
  TFetchProcessError,
  TFetchProcessLoaded,
  TFetchProcessLoading,
} from '../../common/models/data.model'
import { AppThunk, RootState } from '../../store'
import { INGREDIENTS_API_ENDPOINT } from '../app/app.constant'

import { IBurgerIngredientsState } from './burger-ingredients.model'

/** Actions */

enum ActionKind {
  Pending = 'burgerIngredients/requestStatus/pending',
  Fulfilled = 'burgerIngredients/requestStatus/fulfilled',
  Rejected = 'burgerIngredients/requestStatus/rejected',
}

/** Initial state */

const initialState: IBurgerIngredientsState = {
  status: 'idle',
  items: [],
}

/** Selectors */

export const ingredientsSelector = (state: RootState): IBurgerIngredient[] =>
  state.burgerIngredients.items

export const ingredientsFetchStatusSelector = (state: RootState): TFetchProcess =>
  state.burgerIngredients.status

export const selectIngredientsByType = createSelector([ingredientsSelector], (ingredients) =>
  memoize((type: TBurgerIngredientType) =>
    ingredients.filter((ingredient) => ingredient.type === type),
  ),
)

/** Action creators */

export const startIngredientsFetching = (): PayloadAction<
  { status: TFetchProcessLoading },
  ActionKind.Pending
> => ({
  type: ActionKind.Pending,
  payload: {
    status: 'loading',
  },
})

export const finishIngredientsFetching = (
  data: IBurgerIngredient[],
): PayloadAction<
  {
    status: TFetchProcessLoaded
    items: IBurgerIngredient[]
  },
  ActionKind.Fulfilled
> => ({
  type: ActionKind.Fulfilled,
  payload: { status: 'loaded', items: data },
})

export const rejectIngredientsFetching = (): PayloadAction<
  { status: TFetchProcessError },
  ActionKind.Rejected
> => ({
  type: ActionKind.Rejected,
  payload: { status: 'error' },
})

export const fetchIngredients = (): AppThunk => async (dispatch, getState) => {
  const controller = new AbortController()
  const { signal } = controller

  dispatch(startIngredientsFetching())

  try {
    const response = await fetch(INGREDIENTS_API_ENDPOINT, { signal })

    if (!response.ok) {
      throw new Error(`Ingredients fetching was failed with "HTTP status code": ${response.status}`)
    }

    const result: IBurgerIngredientFetch = await response.json()

    dispatch(finishIngredientsFetching(result.data))
  } catch (e) {
    if (!controller.signal.aborted) {
      // eslint-disable-next-line no-console
      console.error(e)

      dispatch(rejectIngredientsFetching())
    }
  }
}

/** Reducer */

export const burgerIngredientsReducer = produce((draft, action: AnyAction) => {
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
