/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { IPasswordForgotRequestBody, TPasswordForgotResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'
import { IAxiosSerializedError, IUnknownDefaultError } from '../../common/models/errors.model'
import { getSerializedAxiosError } from '../../common/utils/errors.utils'
import apiInstance from '../../services/interceptors/client.interceptor'
import { RootState } from '../../store'

import { IForgotPasswordPageState } from './forgot-password-page.model'

const initialState: IForgotPasswordPageState = {
  status: 'idle',
  res: null,
}

export const passwordForgotStatusSelector = (state: RootState): TFetchProcess =>
  state.forgotPassword.status

export const sendPasswordRestorationEmail = createAsyncThunk<
  TPasswordForgotResponse,
  IPasswordForgotRequestBody,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('forgotPassword/post', async (data: IPasswordForgotRequestBody, thunkApi) => {
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
  name: 'forgotPassword',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(sendPasswordRestorationEmail.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(sendPasswordRestorationEmail.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.res = action.payload
    })
    builder.addCase(sendPasswordRestorationEmail.rejected, (state, action) => {
      state.status = 'error'
      state.res = null
    })
  },
})

export default forgotPasswordPageSlice.reducer
