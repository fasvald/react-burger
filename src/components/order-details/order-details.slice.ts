/* eslint-disable no-param-reassign */

/** Actions */

import { PayloadAction } from '@reduxjs/toolkit'
import produce from 'immer'
import { AnyAction } from 'redux'

import {
  TFetchProcess,
  TFetchProcessError,
  TFetchProcessLoaded,
  TFetchProcessLoading,
} from '../../common/models/data.model'
import { AppThunk, RootState } from '../../store'
import { ORDER_CREATION_API_ENDPOINT } from '../app/app.constant'

import { IOrderDetails, IOrderDetailsBody, IOrderDetailsState } from './order-details.model'
import getOrderDetailsPostBody from './order-details.utils'

enum ActionKind {
  Pending = 'orderDetails/requestStatus/pending',
  Fulfilled = 'orderDetails/requestStatus/fulfilled',
  Rejected = 'orderDetails/requestStatus/rejected',
}

/** Initial state */

const initialState: IOrderDetailsState = {
  status: 'idle',
  order: null,
}

/** Selectors */

export const orderDetailsSelector = (state: RootState): IOrderDetails | null =>
  state.orderDetails.order

export const orderDetailsStatusSelector = (state: RootState): TFetchProcess =>
  state.orderDetails.status

/** Action creators */

export const orderDetailsPending = (): PayloadAction<
  { status: TFetchProcessLoading },
  ActionKind.Pending
> => ({
  type: ActionKind.Pending,
  payload: {
    status: 'loading',
  },
})

export const orderDetailsFulfilled = (
  order: IOrderDetails,
): PayloadAction<
  {
    status: TFetchProcessLoaded
    item: IOrderDetails
  },
  ActionKind.Fulfilled
> => ({
  type: ActionKind.Fulfilled,
  payload: { status: 'loaded', item: order },
})

export const orderDetailsFailed = (): PayloadAction<
  { status: TFetchProcessError },
  ActionKind.Rejected
> => ({
  type: ActionKind.Rejected,
  payload: { status: 'error' },
})

// We return Promise to catch the finish result of this action creator
export const createOrder =
  (body: IOrderDetailsBody): AppThunk<Promise<IOrderDetails>> =>
  (dispatch, getState) => {
    const controller = new AbortController()
    const { signal } = controller

    dispatch(orderDetailsPending())

    return new Promise((resolve, reject) => {
      fetch(ORDER_CREATION_API_ENDPOINT, getOrderDetailsPostBody(body, signal))
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Order creation failed with "HTTP status code": ${response.status}`)
          }

          return response.json()
        })
        .then((result: IOrderDetails) => {
          dispatch(orderDetailsFulfilled(result))

          resolve(result)
        })
        .catch((err) => {
          if (!controller.signal.aborted) {
            // eslint-disable-next-line no-console
            console.error(err)

            dispatch(orderDetailsFailed())

            reject(err)
          }
        })
    })
  }

/** Reducer */

export const orderDetailsReducer = produce((draft, action: AnyAction) => {
  const { type, payload } = action as PayloadAction<{ status: TFetchProcess; item: IOrderDetails }>

  switch (type) {
    case ActionKind.Pending: {
      draft.status = payload.status

      return draft
    }
    case ActionKind.Fulfilled: {
      draft.status = payload.status
      draft.order = payload.item

      return draft
    }
    case ActionKind.Rejected: {
      draft.status = payload.status
      draft.order = null

      return draft
    }
    default:
      return draft
  }
}, initialState)
