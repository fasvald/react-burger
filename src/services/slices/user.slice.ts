/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'

import { API_ENDPOINTS } from '@common/constants/api.constant'
import { IAuthUser, IProfileResponse } from '@common/models/auth.model'
import { IAxiosSerializedError, IUnknownDefaultError } from '@common/models/errors.model'
import { getAuthorizedHeader } from '@common/utils/auth.utils'
import { getSerializedAxiosError } from '@common/utils/errors.utils'
import { RootState } from '@store'

import apiInstance from '../interceptors/client.interceptor'

export interface IUserState {
  user: IAuthUser | null
}

const initialState: IUserState = {
  user: null,
}

export const userSelector = (state: RootState): IAuthUser | null => state.user.user

export const getUser = createAsyncThunk<
  IProfileResponse,
  undefined,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('user/fetch', async (_, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
      source.cancel('Operation stop the work.')
    })

    const response = await apiInstance.get<IProfileResponse>(API_ENDPOINTS.profile, {
      cancelToken: source.token,
      headers: {
        ...getAuthorizedHeader(),
      },
    })

    return response.data
  } catch (err) {
    // https://github.com/microsoft/TypeScript/issues/20024
    // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    if (axios.isCancel(err)) {
      return thunkApi.rejectWithValue('Profile fetching stop the work. This has been aborted!')
    }

    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
    }

    return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
  }
})

export const updateUser = createAsyncThunk<
  IProfileResponse,
  IAuthUser,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('user/update', async (data: IAuthUser, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
      source.cancel('Operation stop the work.')
    })

    const response = await apiInstance.patch<IAuthUser, AxiosResponse<IProfileResponse>>(
      API_ENDPOINTS.profile,
      data,
      {
        cancelToken: source.token,
        headers: {
          ...getAuthorizedHeader(),
        },
      },
    )

    return response.data
  } catch (err) {
    // https://github.com/microsoft/TypeScript/issues/20024
    // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
    if (axios.isCancel(err)) {
      return thunkApi.rejectWithValue('Personal info update stop the work. This has been aborted!')
    }

    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
    }

    return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser(state, action: PayloadAction<IAuthUser>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    },
  },
})

export const { saveUser, clearUser } = userSlice.actions

export default userSlice.reducer
