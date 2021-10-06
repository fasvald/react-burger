/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse, AxiosError } from 'axios'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { ISignUpRequestBody, TSignUpResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'
import { RootState } from '../../store'

import { IRegisterPageState } from './register-page.model'

const initialState: IRegisterPageState = {
  status: 'idle',
  res: null,
}

export const signUpStatusSelector = (state: RootState): TFetchProcess => state.signUp.status

export const signUp = createAsyncThunk(
  'signUp/post',
  async (data: ISignUpRequestBody, { rejectWithValue, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
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
        return rejectWithValue('Ingredients fetching stop the work. This has been aborted!')
      }

      return rejectWithValue((err as AxiosError)?.message)
    }
  },
)

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
