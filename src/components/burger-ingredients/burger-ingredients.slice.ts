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

const burgerIngredientsSelector = (state: RootState) => state.burgerIngredients.items
const burgerIngredientsStatusSelector = (state: RootState) => state.burgerIngredients.status

export const selectBurgerIngredients = createSelector(
  [burgerIngredientsSelector],
  (burgerIngredients: IBurgerIngredient[]) => burgerIngredients,
)

export const selectBurgerIngredientsStatus = createSelector(
  [burgerIngredientsStatusSelector],
  (burgerIngredientsStatus: TFetchProcess) => burgerIngredientsStatus,
)

export const selectBurgerIngredientsByType = createSelector(
  [burgerIngredientsSelector],
  (ingredients) =>
    memoize((type: TBurgerIngredientType) =>
      ingredients.filter((ingredient) => ingredient.type === type),
    ),
)

/** Action creators */

export const burgerIngredientsPending = (): PayloadAction<
  { status: TFetchProcessLoading },
  ActionKind.Pending
> => ({
  type: ActionKind.Pending,
  payload: {
    status: 'loading',
  },
})

export const burgerIngredientsFulfilled = (
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

export const burgerIngredientsFailed = (): PayloadAction<
  { status: TFetchProcessError },
  ActionKind.Rejected
> => ({
  type: ActionKind.Rejected,
  payload: { status: 'error' },
})

export const fetchBurgerIngredients = (): AppThunk => async (dispatch, getState) => {
  const controller = new AbortController()
  const { signal } = controller

  dispatch(burgerIngredientsPending())

  try {
    const response = await fetch(INGREDIENTS_API_ENDPOINT, { signal })

    if (!response.ok) {
      throw new Error(`Ingredients fetching was failed with "HTTP status code": ${response.status}`)
    }

    const result: IBurgerIngredientFetch = await response.json()

    dispatch(burgerIngredientsFulfilled(result.data))
  } catch (e) {
    if (!controller.signal.aborted) {
      dispatch(burgerIngredientsFailed())

      // eslint-disable-next-line no-console
      console.error(e)
    }
  }
}

/** Reducer */

export const burgerIngredientsReducer = produce((draft, action: AnyAction) => {
  const { type, payload } = action

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
