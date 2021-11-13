/* eslint-disable no-param-reassign */

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { memoize } from 'lodash'

import { TFetchProcess } from '@common/models/fetch-process.model'
import { IOrder, IOrdersResponse, TOrderStatuses } from '@common/models/orders.model'
import { getUsersOrders } from '@services/slices/orders.slice'
import { RootState } from '@store'

interface IProfileOrdersListPageState {
  status: TFetchProcess
  orders: IOrder[]
  total: number | null
  totalToday: number | null
}

const initialState: IProfileOrdersListPageState = {
  status: 'idle',
  orders: [],
  total: null,
  totalToday: null,
}

export const ordersFetchStatusSelector = (state: RootState): TFetchProcess =>
  state.profileOrdersListPage.status

export const ordersSelector = (state: RootState): IOrder[] => state.profileOrdersListPage.orders

export const ordersTotalCountSelector = (state: RootState): number | null =>
  state.profileOrdersListPage.total

export const ordersTotalTodayCountSelector = (state: RootState): number | null =>
  state.profileOrdersListPage.totalToday

export const selectOrdersByStatus = createSelector([ordersSelector], (orders) =>
  memoize((status: TOrderStatuses) => orders.filter((order) => order.status === status)),
)

const profileOrdersListPage = createSlice({
  name: 'profilePage/orders',
  initialState,
  reducers: {
    // Manual update orders in the store (usually as callback for web socket update event)
    updateOrders(state, action: PayloadAction<{ data: IOrdersResponse }>) {
      state.orders = action.payload.data.orders
      state.total = action.payload.data.total
      state.totalToday = action.payload.data.totalToday
    },
  },
  extraReducers(builder) {
    builder.addCase(getUsersOrders.pending, (state) => {
      state.status = 'loading'
      state.orders = []
      state.total = null
      state.totalToday = null
    })
    builder.addCase(getUsersOrders.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.orders = action.payload.orders
      state.total = action.payload.total
      state.totalToday = action.payload.totalToday
    })
    builder.addCase(getUsersOrders.rejected, (state) => {
      state.status = 'error'
      state.orders = []
      state.total = null
      state.totalToday = null
    })
  },
})

export const { updateOrders } = profileOrdersListPage.actions

export default profileOrdersListPage.reducer
