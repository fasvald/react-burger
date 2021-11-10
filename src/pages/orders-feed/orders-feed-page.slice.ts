/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { memoize } from 'lodash'

import { API_ENDPOINTS } from '@common/constants/api.constant'
import { IAxiosSerializedError, IUnknownDefaultError } from '@common/models/errors.model'
import { TFetchProcess } from '@common/models/fetch-process.model'
import { getSerializedAxiosError } from '@common/utils/errors.utils'
import apiInstance from '@services/interceptors/client.interceptor'
import { RootState } from '@store'

import { IOrder, TOrderStatuses, IOrdersFeedResponse, initialState } from './orders-feed-page.model'

export const ordersFeedStatusSelector = (state: RootState): TFetchProcess =>
  state.ordersFeedPage.status

export const ordersFeedSelector = (state: RootState): IOrder[] => state.ordersFeedPage.orders

export const ordersTotalCountSelector = (state: RootState): number | null =>
  state.ordersFeedPage.total

export const ordersTotalTodayCountSelector = (state: RootState): number | null =>
  state.ordersFeedPage.totalToday

export const selectOrdersByStatus = createSelector([ordersFeedSelector], (orders) =>
  memoize((status: TOrderStatuses) => orders.filter((order) => order.status === status)),
)

export const getOrders = createAsyncThunk<
  IOrdersFeedResponse,
  undefined,
  {
    state: RootState
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>(
  'ordersFeed/fetchAll',
  async (_, thunkApi) => {
    try {
      const source = axios.CancelToken.source()
      thunkApi.signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await apiInstance.get<IOrdersFeedResponse>(API_ENDPOINTS.ordersFeed, {
        cancelToken: source.token,
      })

      return response.data
    } catch (err) {
      // https://github.com/microsoft/TypeScript/issues/20024
      // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
      if (axios.isCancel(err)) {
        return thunkApi.rejectWithValue(
          'Orders feed fetching stop the work. This has been aborted!',
        )
      }

      if (axios.isAxiosError(err)) {
        return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
      }

      return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
    }
  },
  {
    // eslint-disable-next-line consistent-return
    condition: (_, thunkApi) => {
      const { ordersFeedPage } = thunkApi.getState()
      const fetchStatus = ordersFeedPage.status

      if (fetchStatus === 'loaded' || fetchStatus === 'loading') {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
    },
  },
)

const ordersFeedPageSlice = createSlice({
  name: 'ordersFeedPage',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getOrders.pending, (state) => {
      state.status = 'loading'
      state.orders = []
      state.total = null
      state.totalToday = null
    })
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.orders = action.payload.orders
      state.total = action.payload.total
      state.totalToday = action.payload.totalToday
    })
    builder.addCase(getOrders.rejected, (state) => {
      state.status = 'error'
      state.orders = []
      state.total = null
      state.totalToday = null
    })
  },
})

export default ordersFeedPageSlice.reducer
