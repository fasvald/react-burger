/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, AxiosResponse } from 'axios'

import { TFetchProcess } from '../../common/models/data.model'
import { AUTH_FORGOT_PASSWORD_ENDPOINT } from '../../components/app/app.constant'
import { RootState } from '../../store'

import {
  IForgotPasswordRequestBody,
  IForgotPasswordResponse,
  IForgotPasswordState,
} from './forgot-password-page.model'

const initialState: IForgotPasswordState = {
  status: 'idle',
  success: false,
  message: '',
}

export const forgotPasswordStatusSelector = (state: RootState): TFetchProcess =>
  state.forgotPassword.status

// NOTE: We can use RTK Query API to reduce this code in half, but because we are using axios it's impossible to do this
export const sendEmailWithRestorationCode = createAsyncThunk(
  'forgotPassword/post',
  async (data: IForgotPasswordRequestBody, { rejectWithValue, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await axios.post<
        IForgotPasswordRequestBody,
        AxiosResponse<IForgotPasswordResponse>
      >(AUTH_FORGOT_PASSWORD_ENDPOINT, data, {
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

const forgotPasswordPageSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(sendEmailWithRestorationCode.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(sendEmailWithRestorationCode.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.message = action.payload.message
      state.success = action.payload.success
    })
    builder.addCase(sendEmailWithRestorationCode.rejected, (state, action) => {
      state.status = 'error'
      state.message = ''
      state.success = false
    })
  },
})

export default forgotPasswordPageSlice.reducer
