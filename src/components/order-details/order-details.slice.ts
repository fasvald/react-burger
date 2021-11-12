/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '@common/constants/api.constant'
import { IAxiosSerializedError, IUnknownDefaultError } from '@common/models/errors.model'
import { TFetchProcess } from '@common/models/fetch-process.model'
import { getAuthorizedHeader } from '@common/utils/auth.utils'
import { getSerializedAxiosError } from '@common/utils/errors.utils'
import apiInstance from '@services/interceptors/client.interceptor'
import { RootState } from '@store'

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

export const checkoutOrder = createAsyncThunk<
  IOrderDetailsResponse,
  IOrderDetailsBody,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('order/checkout', async (data: IOrderDetailsBody, thunkApi) => {
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
      headers: {
        ...getAuthorizedHeader(),
      },
    })

    return response.data
  } catch (err) {
    // https://github.com/microsoft/TypeScript/issues/20024
    // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    if (axios.isCancel(err)) {
      return thunkApi.rejectWithValue(
        'Order creation (checkout) stop the work. This has been aborted!',
      )
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
    builder.addCase(checkoutOrder.pending, (state) => {
      state.status = 'loading'
      state.order = null
    })
    builder.addCase(checkoutOrder.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.order = action.payload
    })
    builder.addCase(checkoutOrder.rejected, (state) => {
      state.status = 'error'
      state.order = null
    })
  },
})

export default orderDetailsSlice.reducer
