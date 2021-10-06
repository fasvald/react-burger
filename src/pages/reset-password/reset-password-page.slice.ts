/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { IPasswordResetRequestBody, TPasswordResetResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'
import { RootState } from '../../store'

import { IResetPasswordPageState } from './reset-password-page.model'

const initialState: IResetPasswordPageState = {
  status: 'idle',
  res: null,
}

export const passwordResetStatusSelector = (state: RootState): TFetchProcess =>
  state.resetPassword.status

export const resetPassword = createAsyncThunk(
  'resetPassword/post',
  async (data: IPasswordResetRequestBody, { rejectWithValue, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
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
      state.res = action.payload
    })
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.status = 'error'
      state.res = null
    })
  },
})

export default resetPasswordSlice.reducer
