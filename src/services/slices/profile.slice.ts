/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'

import { API_ENDPOINTS } from '../../common/constants/api.constant'
import { IAuthUser, IProfileResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'
import { RootState } from '../../store'

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

export const getProfile = createAsyncThunk(
  'profile/get',
  async (_, { rejectWithValue, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await axios.get<IProfileResponse>(API_ENDPOINTS.profile, {
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
        // TODO: FIX THE TEXT !!!
        return rejectWithValue('Ingredients fetching stop the work. This has been aborted!')
      }

      return rejectWithValue((err as AxiosError)?.message)
    }
  },
)

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
