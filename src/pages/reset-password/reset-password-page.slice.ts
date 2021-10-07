/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { IPasswordResetRequestBody, TPasswordResetResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'
import { IAxiosSerializedError, IUnknownDefaultError } from '../../common/models/errors.model'
import { getSerializedAxiosError } from '../../common/utils/errors.utils'
import { RootState } from '../../store'

import { IResetPasswordPageState } from './reset-password-page.model'

const initialState: IResetPasswordPageState = {
  status: 'idle',
  res: null,
}

export const passwordResetStatusSelector = (state: RootState): TFetchProcess =>
  state.resetPassword.status

export const resetPassword = createAsyncThunk<
  TPasswordResetResponse,
  IPasswordResetRequestBody,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('resetPassword/post', async (data: IPasswordResetRequestBody, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
      source.cancel('Operation stop the work.')
    })

    const response = await axios.post<
      IPasswordResetRequestBody,
      AxiosResponse<TPasswordResetResponse>
    >(API_ENDPOINTS.passwordReset, data, {
      cancelToken: source.token,
    })

    return response.data
  } catch (err) {
    // https://github.com/microsoft/TypeScript/issues/20024
    // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    if (axios.isCancel(err)) {
      return thunkApi.rejectWithValue('Reset password stop the work. This has been aborted!')
    }

    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
    }

    return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
  }
})

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(resetPassword.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.res = action.payload
    })
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.status = 'error'
      state.res = null
    })
  },
})

export default resetPasswordSlice.reducer
