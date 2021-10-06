/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { TFetchProcess } from '../../common/models/data.model'
import { RootState } from '../../store'

import {
  IOrderDetails,
  IOrderDetailsBody,
  IOrderDetailsResponse,
  IOrderDetailsState,
} from './order-details.model'

const initialState: IOrderDetailsState = {
  status: 'idle',
  order: null,
}

export const orderSelector = (state: RootState): IOrderDetails | null => state.orderDetails.order

export const orderCreationStatusSelector = (state: RootState): TFetchProcess =>
  state.orderDetails.status

export const createOrder = createAsyncThunk(
  'orderDetails/post',
  async (data: IOrderDetailsBody, { rejectWithValue, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await axios.post<IOrderDetailsBody, AxiosResponse<IOrderDetailsResponse>>(
        API_ENDPOINTS.orders,
        data,
        {
          cancelToken: source.token,
        },
      )

      return response.data
    } catch (err) {
      // https://github.com/microsoft/TypeScript/issues/20024
      // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
      if (axios.isCancel(err)) {
        return rejectWithValue('Order creation stop the work. This has been aborted!')
      }

      return rejectWithValue((err as AxiosError)?.message)
    }
  },
)

export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(createOrder.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.order = action.payload
    })
    builder.addCase(createOrder.rejected, (state, action) => {
      state.status = 'error'
      state.order = null
    })
  },
})

export default orderDetailsSlice.reducer
