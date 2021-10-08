/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { IAuthUser, ISignOutResponse } from '../../common/models/auth.model'
import { IAxiosSerializedError, IUnknownDefaultError } from '../../common/models/errors.model'
import { getSerializedAxiosError } from '../../common/utils/errors.utils'
import { RootState } from '../../store'
import apiInstance from '../interceptors/client.interceptor'

interface IAuthState {
  isLoggedIn: boolean
  user: IAuthUser | null
}

const initialState: IAuthState = {
  isLoggedIn: false,
  user: null,
}

export const authSelector = (state: RootState): IAuthState => state.auth

export const signOut = createAsyncThunk('signOut/post', async (_, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
      source.cancel('Operation stop the work.')
    })

    const refreshToken = Cookies.get('sb-refreshToken') as string

    const response = await apiInstance.post<{ token: string }, AxiosResponse<ISignOutResponse>>(
      API_ENDPOINTS.singOut,
      { token: refreshToken },
      {
        cancelToken: source.token,
      },
    )

    return response.data
  } catch (err) {
    // https://github.com/microsoft/TypeScript/issues/20024
    // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    if (axios.isCancel(err)) {
      return thunkApi.rejectWithValue('Sign out stop the work. This has been aborted!')
    }

    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
    }

    return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveAuthorizedUser: (state, action: PayloadAction<IAuthUser>) => {
      state.isLoggedIn = true
      state.user = action.payload
    },
    clearAuthorizedUser: (state, action) => {
      state.isLoggedIn = false
      state.user = null
    },
  },
  extraReducers(builder) {
    builder.addCase(signOut.fulfilled, (state, action) => {
      state.isLoggedIn = false
      state.user = null
    })
  },
})

export const { saveAuthorizedUser, clearAuthorizedUser } = authSlice.actions

export default authSlice.reducer
