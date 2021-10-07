/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { IPasswordForgotRequestBody, TPasswordForgotResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'
import { RootState } from '../../store'

import { IForgotPasswordPageState } from './forgot-password-page.model'

const initialState: IForgotPasswordPageState = {
  status: 'idle',
  res: null,
}

export const passwordForgotStatusSelector = (state: RootState): TFetchProcess =>
  state.forgotPassword.status

export const sendPasswordRestorationEmail = createAsyncThunk(
  'forgotPassword/post',
  async (data: IPasswordForgotRequestBody, { rejectWithValue, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await axios.post<
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