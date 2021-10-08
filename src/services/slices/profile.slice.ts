/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { IAuthUser, IProfileResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'
import { IAxiosSerializedError, IUnknownDefaultError } from '../../common/models/errors.model'
import { getSerializedAxiosError } from '../../common/utils/errors.utils'
import { RootState } from '../../store'
import apiInstance from '../interceptors/client.interceptor'

interface IProfileState {
  status: TFetchProcess
  user: IAuthUser | null
}

const initialState: IProfileState = {
  status: 'idle',
  user: null,
}

export const profileSelector = (state: RootState): IAuthUser | null => state.profile.user

export const profileFetchStatusSelector = (state: RootState): TFetchProcess => state.profile.status

export const getProfile = createAsyncThunk<
  IProfileResponse,
  undefined,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('profile/get', async (_, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
      source.cancel('Operation stop the work.')
    })

    const response = await apiInstance.get<IProfileResponse>(API_ENDPOINTS.profile, {
      cancelToken: source.token,
      headers: {
        Authorization: `Bearer ${Cookies.get('sb-authToken')}`,
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

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileInStore(state, action: PayloadAction<IAuthUser>) {
      // state.status = 'idle'
      state.user = action.payload
    },
    clearProfile(state, action) {
      state.status = 'idle'
      state.user = null
    },
  },
  extraReducers(builder) {
    builder.addCase(getProfile.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.user = action.payload.user
    })
    builder.addCase(getProfile.rejected, (state, action) => {
      state.status = 'error'
      state.user = null
    })
  },
})

export const { clearProfile, updateProfileInStore } = profileSlice.actions

export default profileSlice.reducer
