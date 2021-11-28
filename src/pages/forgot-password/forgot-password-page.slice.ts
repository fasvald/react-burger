/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '@common/constants/api.constant'
import { IPasswordForgotRequestBody, TPasswordForgotResponse } from '@common/models/auth.model'
import { IAxiosSerializedError, IUnknownDefaultError } from '@common/models/errors.model'
import { TFetchProcess } from '@common/models/fetch-process.model'
import { getSerializedAxiosError } from '@common/utils/errors.utils'
import apiInstance from '@services/interceptors/client.interceptor'
import { RootState } from '@store'

export interface IForgotPasswordPageState {
  status: TFetchProcess
  res: TPasswordForgotResponse | null
}

const initialState: IForgotPasswordPageState = {
  status: 'idle',
  res: null,
}

export const forgotPasswordStatusSelector = (state: RootState): TFetchProcess =>
  state.forgotPasswordPage.status

export const sendPasswordRestorationCode = createAsyncThunk<
  TPasswordForgotResponse,
  IPasswordForgotRequestBody,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('forgotPassword/restorationCode', async (data: IPasswordForgotRequestBody, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
      source.cancel('Operation stop the work.')
    })

    const response = await apiInstance.post<
      IPasswordForgotRequestBody,
      AxiosResponse<TPasswordForgotResponse>
    >(API_ENDPOINTS.passwordForgot, data, {
      cancelToken: source.token,
    })

    return response.data
  } catch (err) {
    // https://github.com/microsoft/TypeScript/issues/20024
    // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    if (axios.isCancel(err)) {
      return thunkApi.rejectWithValue('Forgot password stop the work. This has been aborted!')
    }

    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
    }

    return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
  }
})

const forgotPasswordPageSlice = createSlice({
  name: 'forgotPasswordPage',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(sendPasswordRestorationCode.pending, (state) => {
      state.status = 'loading'
      state.res = null
    })
    builder.addCase(sendPasswordRestorationCode.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.res = action.payload
    })
    builder.addCase(sendPasswordRestorationCode.rejected, (state) => {
      state.status = 'error'
      state.res = null
    })
  },
})

export default forgotPasswordPageSlice.reducer
