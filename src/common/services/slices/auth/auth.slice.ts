/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError, AxiosResponse } from 'axios'

import { AUTH_SIGN_UP_ENDPOINT } from '../../../../components/app/app.constant'
import { RootState } from '../../../../store'

import { IAuthSignUpBodyRequest, IAuthSignUpResponse, IAuthState } from './auth.model'

const initialState: IAuthState | null = {
  status: 'idle',
  user: {
    name: '',
    email: '',
  },
  accessToken: '',
  refreshToken: '',
}

export const authSelector = (state: RootState): IAuthState | null => state.auth

export const signUp = createAsyncThunk(
  'signUp/post',
  async (data: IAuthSignUpBodyRequest, { rejectWithValue, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await axios.post<IAuthSignUpBodyRequest, AxiosResponse<IAuthSignUpResponse>>(
        AUTH_SIGN_UP_ENDPOINT,
        data,
        {
          cancelToken: source.token,
        },
      )

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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(signUp.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    })
    builder.addCase(signUp.rejected, (state, action) => {
      state.status = 'error'
      state.user = { name: '', email: '' }
      state.accessToken = ''
      state.refreshToken = ''
    })
  },
})

export default authSlice.reducer
