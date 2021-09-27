/* eslint-disable no-param-reassign */

import { PayloadAction } from '@reduxjs/toolkit'
import produce from 'immer'
import { AnyAction } from 'redux'

import { TFetchProcess } from '../../common/models/data.model'
import {
  IOrderDetails,
  IOrderDetailsState,
} from '../../components/order-details/order-details.model'
import { ActionKind } from '../actions/order-details.actions'

const initialState: IOrderDetailsState = {
  status: 'idle',
  order: null,
}

const orderDetailsReducer = produce((draft, action: AnyAction) => {
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

export default orderDetailsReducer
