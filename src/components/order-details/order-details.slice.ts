/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit'

import { TFetchProcess } from '../../common/models/data.model'
import { RootState } from '../../store'
import { ORDER_CREATION_API_ENDPOINT } from '../app/app.constant'

import { IOrderDetails, IOrderDetailsBody, IOrderDetailsState } from './order-details.model'
import getOrderDetailsPostBody from './order-details.utils'

const initialState: IOrderDetailsState = {
  status: 'idle',
  order: null,
}

export const orderSelector = (state: RootState): IOrderDetails | null => state.orderDetails.order

export const orderCreationStatusSelector = (state: RootState): TFetchProcess =>
  state.orderDetails.status

export const createOrder = createAsyncThunk(
  'orderDetails/creation',
  async (body: IOrderDetailsBody, { rejectWithValue, signal }) => {
    try {
      const response = await fetch(ORDER_CREATION_API_ENDPOINT, getOrderDetailsPostBody(body))

      if (!response.ok) {
        throw new Error(`Order creation was failed with "HTTP status code": ${response.status}`)
      }

      const result: IOrderDetails = await response.json()

      return result
    } catch (err) {
      // https://github.com/microsoft/TypeScript/issues/20024
      // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
      if (signal.aborted) {
        return rejectWithValue('Order creation stop the work. This has been aborted!')
      }

      return rejectWithValue((err as SerializedError)?.message)
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
