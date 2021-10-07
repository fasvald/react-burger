/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse, AxiosError } from 'axios'
import Cookies from 'js-cookie'

import { API_ENDPOINTS } from '../../../common/constants/api.constant'
import { IAuthUser, IProfileResponse } from '../../../common/models/auth.model'
import { TFetchProcess } from '../../../common/models/data.model'
import { RootState } from '../../../store'

interface IPersonalInfoPageState {
  status: TFetchProcess
  res: IProfileResponse | null
}

const initialState: IPersonalInfoPageState = {
  status: 'idle',
  res: null,
}

export const updateProfileStatusSelector = (state: RootState): TFetchProcess =>
  state.personalInfo.status

export const updateProfile = createAsyncThunk(
  'profile/patch',
  async (data: IAuthUser, { rejectWithValue, signal }) => {
    try {
      const source = axios.CancelToken.source()
      signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await axios.patch<IAuthUser, AxiosResponse<IProfileResponse>>(
        API_ENDPOINTS.profile,
        data,
        {
          cancelToken: source.token,
          headers: {
            Authorization: `Bearer ${Cookies.get('sb-authToken')}`,
          },
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

export const personalInfoPageSlice = createSlice({
  name: 'personalInfo',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(updateProfile.pending, (state, action) => {
      state.status = 'loading'
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.res = action.payload
    })
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.status = 'error'
      state.res = null
    })
  },
})

export default personalInfoPageSlice.reducer
