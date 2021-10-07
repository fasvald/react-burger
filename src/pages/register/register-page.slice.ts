/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { ISignUpRequestBody, TSignUpResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'
import { IAxiosSerializedError, IUnknownDefaultError } from '../../common/models/errors.model'
import { getSerializedAxiosError } from '../../common/utils/errors.utils'
import { RootState } from '../../store'

import { IRegisterPageState } from './register-page.model'

const initialState: IRegisterPageState = {
  status: 'idle',
  res: null,
}

export const signUpStatusSelector = (state: RootState): TFetchProcess => state.signUp.status

export const signUp = createAsyncThunk<
  TSignUpResponse,
  ISignUpRequestBody,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('signUp/post', async (data: ISignUpRequestBody, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
      source.cancel('Operation stop the work.')
    })

    const response = await axios.post<ISignUpRequestBody, AxiosResponse<TSignUpResponse>>(
      API_ENDPOINTS.signUp,
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
      return thunkApi.rejectWithValue('Sign up stop the work. This has been aborted!')
    }

    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
    }

    return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
  }
})

export const registerPageSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(signUp.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.res = action.payload
    })
    builder.addCase(signUp.rejected, (state, action) => {
      state.status = 'error'
      state.res = null
    })
  },
})

export default registerPageSlice.reducer
