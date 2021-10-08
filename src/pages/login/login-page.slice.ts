/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { ISignInRequestBody, TSignInResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'
import { IAxiosSerializedError, IUnknownDefaultError } from '../../common/models/errors.model'
import { getSerializedAxiosError } from '../../common/utils/errors.utils'
import apiInstance from '../../services/interceptors/client.interceptor'
import { RootState } from '../../store'

import { ILoginPageState } from './login-page.model'

const initialState: ILoginPageState = {
  status: 'idle',
  res: null,
}

export const signInStatusSelector = (state: RootState): TFetchProcess => state.signIn.status

export const signIn = createAsyncThunk<
  TSignInResponse,
  ISignInRequestBody,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('signIn/post', async (data: ISignInRequestBody, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
      source.cancel('Operation stop the work.')
    })

    const response = await apiInstance.post<ISignInRequestBody, AxiosResponse<TSignInResponse>>(
      API_ENDPOINTS.signIn,
      data,
      {
        cancelToken: source.token,
      },
    )

    return response.data as TSignInResponse
  } catch (err) {
    // https://github.com/microsoft/TypeScript/issues/20024
    // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    if (axios.isCancel(err)) {
      return thunkApi.rejectWithValue('Sign in stop the work. This has been aborted!')
    }

    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
    }

    return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
  }
})

export const loginPageSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(signIn.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.res = action.payload
    })
    builder.addCase(signIn.rejected, (state, action) => {
      state.status = 'error'
      state.res = null
    })
  },
})

export default loginPageSlice.reducer
