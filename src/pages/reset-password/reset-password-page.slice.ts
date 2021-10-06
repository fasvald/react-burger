/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, AxiosResponse } from 'axios'

import { TFetchProcess } from '../../common/models/data.model'
import { AUTH_RESET_PASSWORD_ENDPOINT } from '../../components/app/app.constant'
import { RootState } from '../../store'

import {
  IResetPasswordRequestBody,
  IResetPasswordResponse,
  IResetPasswordState,
} from './reset-password-page.model'

const initialState: IResetPasswordState = {
  status: 'idle',
  success: false,
  message: '',
}

export const resetPasswordStatusSelector = (state: RootState): TFetchProcess =>
  state.resetPassword.status

export const resetPassword = createAsyncThunk(
  'resetPassword/post',
  async (data: IResetPasswordRequestBody, { rejectWithValue, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await axios.post<
        IResetPasswordRequestBody,
        AxiosResponse<IResetPasswordResponse>
      >(AUTH_RESET_PASSWORD_ENDPOINT, data, {
        cancelToken: source.token,
      })

      return response.data
    } catch (err) {
      // https://github.com/microsoft/TypeScript/issues/20024
      // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
      if (axios.isCancel(err)) {
        return rejectWithValue('Ingredients fetching stop the work. This has been aborted!')
      }

      return rejectWithValue((err as AxiosError)?.message)
    }
  },
)

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
      state.message = action.payload.message
      state.success = action.payload.success
    })
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.status = 'error'
      state.message = ''
      state.success = false
    })
  },
})

export default resetPasswordSlice.reducer
