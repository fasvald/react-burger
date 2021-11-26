import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { API_ENDPOINTS } from '@common/constants/api.constant'
import { IAxiosSerializedError, IUnknownDefaultError } from '@common/models/errors.model'
import {
  IOrder,
  IOrderByNumberBody,
  IOrderByIDResponse,
  IOrdersResponse,
} from '@common/models/orders.model'
import { getAuthorizedHeader } from '@common/utils/auth.utils'
import { getSerializedAxiosError } from '@common/utils/errors.utils'
import apiInstance from '@services/interceptors/client.interceptor'
import { RootState } from '@store'

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
      const fetchStatus = feedPage?.status

      if (fetchStatus === 'loaded' || fetchStatus === 'loading') {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
    },
  },
)

export const getUsersOrders = createAsyncThunk<
  IOrdersResponse,
  boolean,
  {
    state: RootState
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>(
  'ordersUsers/fetch',
  async (isPrivate = false, thunkApi) => {
    try {
      const source = axios.CancelToken.source()
      thunkApi.signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await apiInstance.get<IOrdersResponse>(API_ENDPOINTS.orders, {
        cancelToken: source.token,
        ...(isPrivate && {
          headers: {
            ...getAuthorizedHeader(),
          },
        }),
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
      const fetchStatus = feedPage?.status

      if (fetchStatus === 'loaded' || fetchStatus === 'loading') {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
    },
  },
)

export const getOrderByNumber = createAsyncThunk<
  IOrder,
  IOrderByNumberBody,
  {
    state: RootState
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('orderByNumber/fetch', async ({ orderNumber, isPrivate }: IOrderByNumberBody, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
      source.cancel('Operation stop the work.')
    })

    const response = await apiInstance.get<IOrderByIDResponse>(
      `${API_ENDPOINTS.orders}/${orderNumber}`,
      {
        cancelToken: source.token,
        ...(isPrivate && {
          headers: {
            ...getAuthorizedHeader(),
          },
        }),
      },
    )

    return response.data?.orders[0]
  } catch (err) {
    // https://github.com/microsoft/TypeScript/issues/20024
    // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    if (axios.isCancel(err)) {
      return thunkApi.rejectWithValue('Order fetching by id stop the work. This has been aborted!')
    }

    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
    }

    return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
  }
})
