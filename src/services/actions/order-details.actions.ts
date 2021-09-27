import { PayloadAction } from '@reduxjs/toolkit'

import {
  TFetchProcessError,
  TFetchProcessLoaded,
  TFetchProcessLoading,
} from '../../common/models/data.model'
import { ORDER_CREATION_API_ENDPOINT } from '../../components/app/app.constant'
import {
  IOrderDetails,
  IOrderDetailsBody,
} from '../../components/order-details/order-details.model'
import getOrderDetailsPostBody from '../../components/order-details/order-details.utils'
import { AppThunk } from '../../store'

export enum ActionKind {
  Pending = 'orderDetails/requestStatus/pending',
  Fulfilled = 'orderDetails/requestStatus/fulfilled',
  Rejected = 'orderDetails/requestStatus/rejected',
}

const startOrderCreation = (): PayloadAction<
  { status: TFetchProcessLoading },
  ActionKind.Pending
> => ({
  type: ActionKind.Pending,
  payload: {
    status: 'loading',
  },
})

const finishOrderCreation = (
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

const rejectOrderCreation = (): PayloadAction<
  { status: TFetchProcessError },
  ActionKind.Rejected
> => ({
  type: ActionKind.Rejected,
  payload: { status: 'error' },
})

export const createOrder =
  (body: IOrderDetailsBody): AppThunk<Promise<IOrderDetails>> =>
  (dispatch, getState) => {
    // We can return [controller, Promise] for further request cancellation outside
    const controller = new AbortController()
    const { signal } = controller

    dispatch(startOrderCreation())

    return new Promise((resolve, reject) => {
      fetch(ORDER_CREATION_API_ENDPOINT, getOrderDetailsPostBody(body, signal))
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Order creation failed with "HTTP status code": ${response.status}`)
          }

          return response.json()
        })
        .then((result: IOrderDetails) => {
          dispatch(finishOrderCreation(result))

          resolve(result)
        })
        .catch((err) => {
          if (!controller.signal.aborted) {
            // eslint-disable-next-line no-console
            console.error(err)

            dispatch(rejectOrderCreation())
            reject(err)
          }
        })
    })
  }
