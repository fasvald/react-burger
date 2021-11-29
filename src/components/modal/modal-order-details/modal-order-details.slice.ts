/* eslint-disable no-param-reassign */

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { memoize } from 'lodash'

import { TFetchProcess } from '@common/models/fetch-process.model'
import { IOrder } from '@common/models/orders.model'
import { ordersSelector } from '@pages/feed/feed-page.slice'
import { ordersSelector as ordersUserSelector } from '@pages/profile/profile-orders-list/profile-orders-list-page.slice'
import { getOrderByNumber } from '@services/slices/orders.slice'
import { RootState } from '@store'

export interface IModalOrderDetailsState {
  order: IOrder | null
  status: TFetchProcess
}

const initialState: IModalOrderDetailsState = {
  order: null,
  status: 'idle',
}

export const chosenOrderDetailsSelector = (state: RootState): IOrder | null =>
  state.orderDetails.order

export const orderByNumberFetchingSelector = (state: RootState): TFetchProcess =>
  state.orderDetails.status

export const ordersAllOrUsersSelector = createSelector(
  [ordersSelector, ordersUserSelector],
  (ordersAll, ordersUser) => memoize((isPrivate = false) => (isPrivate ? ordersUser : ordersAll)),
)

// It will pick either chosen order if it in the store (when user clicks on order card)
// or try to find among all order by ID (in case when user reload the page and chosen by click disappeared)
export const selectChosenOrder = createSelector(
  [chosenOrderDetailsSelector, ordersAllOrUsersSelector],
  (chosenOrder, orders) =>
    memoize(
      (number?: number, isPrivate = false) =>
        chosenOrder || orders(isPrivate).find((order) => order.number === number),
    ),
)

const modalOrderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    saveOrderDetails: (state, action: PayloadAction<IOrder>) => {
      state.order = action.payload
    },
    removeOrderDetails: (state) => {
      state.order = null
    },
  },
  extraReducers(builder) {
    builder.addCase(getOrderByNumber.pending, (state) => {
      state.status = 'loading'
      state.order = null
    })
    builder.addCase(getOrderByNumber.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.order = action.payload
    })
    builder.addCase(getOrderByNumber.rejected, (state) => {
      state.status = 'error'
      state.order = null
    })
  },
})

export const { saveOrderDetails, removeOrderDetails } = modalOrderDetailsSlice.actions

export default modalOrderDetailsSlice.reducer
