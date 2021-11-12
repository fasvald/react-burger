/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { memoize } from 'lodash'

import { API_ENDPOINTS } from '@common/constants/api.constant'
import { IAxiosSerializedError, IUnknownDefaultError } from '@common/models/errors.model'
import { TFetchProcess } from '@common/models/fetch-process.model'
import { IOrder, TOrderStatuses, IOrdersResponse } from '@common/models/orders.model'
import { getSerializedAxiosError } from '@common/utils/errors.utils'
import apiInstance from '@services/interceptors/client.interceptor'
import { RootState } from '@store'

interface IFeedPageState {
  status: TFetchProcess
  orders: IOrder[]
  total: number | null
  totalToday: number | null
}

const initialState: IFeedPageState = {
  status: 'idle',
  orders: [],
  total: null,
  totalToday: null,
}

export const ordersFetchStatusSelector = (state: RootState): TFetchProcess => state.feedPage.status

export const ordersSelector = (state: RootState): IOrder[] => state.feedPage.orders

export const ordersTotalCountSelector = (state: RootState): number | null => state.feedPage.total

export const ordersTotalTodayCountSelector = (state: RootState): number | null =>
  state.feedPage.totalToday

export const selectOrdersByStatus = createSelector([ordersSelector], (orders) =>
  memoize((status: TOrderStatuses) => orders.filter((order) => order.status === status)),
)

export const getAllOrders = createAsyncThunk<
  IOrdersResponse,
  undefined,
  {
    state: RootState
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>(
  'ordersAll/fetch',
  async (_, thunkApi) => {
    try {
      const source = axios.CancelToken.source()
      thunkApi.signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await apiInstance.get<IOrdersResponse>(API_ENDPOINTS.ordersAll, {
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
      const { feedPage } = thunkApi.getState()
      const fetchStatus = feedPage.status

      if (fetchStatus === 'loaded' || fetchStatus === 'loading') {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
    },
  },
)

const feedPageSlice = createSlice({
  name: 'feedPage',
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
    builder.addCase(getAllOrders.pending, (state) => {
      state.status = 'loading'
      state.orders = []
      state.total = null
      state.totalToday = null
    })
    builder.addCase(getAllOrders.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.orders = action.payload.orders
      state.total = action.payload.total
      state.totalToday = action.payload.totalToday
    })
    builder.addCase(getAllOrders.rejected, (state) => {
      state.status = 'error'
      state.orders = []
      state.total = null
      state.totalToday = null
    })
  },
})

export const { updateOrders } = feedPageSlice.actions

export default feedPageSlice.reducer
