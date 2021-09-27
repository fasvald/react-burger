import { PayloadAction } from '@reduxjs/toolkit'

import {
  IBurgerIngredient,
  IBurgerIngredientFetch,
  TFetchProcessError,
  TFetchProcessLoaded,
  TFetchProcessLoading,
} from '../../common/models/data.model'
import { INGREDIENTS_API_ENDPOINT } from '../../components/app/app.constant'
import { AppThunk } from '../../store'

export enum ActionKind {
  Pending = 'burgerIngredients/requestStatus/pending',
  Fulfilled = 'burgerIngredients/requestStatus/fulfilled',
  Rejected = 'burgerIngredients/requestStatus/rejected',
}

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
