/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { TFetchProcess } from '../../common/models/data.model'
import { IAxiosSerializedError, IUnknownDefaultError } from '../../common/models/errors.model'
import { getSerializedAxiosError } from '../../common/utils/errors.utils'
import apiInstance from '../../services/interceptors/client.interceptor'
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

export const createOrder = createAsyncThunk<
  IOrderDetailsResponse,
  IOrderDetailsBody,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('orderDetails/post', async (data: IOrderDetailsBody, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
      source.cancel('Operation stop the work.')
    })

    const response = await apiInstance.post<
      IOrderDetailsBody,
      AxiosResponse<IOrderDetailsResponse>
    >(API_ENDPOINTS.orders, data, {
      cancelToken: source.token,
    })

    return response.data
  } catch (err) {
    // https://github.com/microsoft/TypeScript/issues/20024
    // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    if (axios.isCancel(err)) {
      return thunkApi.rejectWithValue('Order creation stop the work. This has been aborted!')
    }

    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
    }

    return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
  }
})

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
