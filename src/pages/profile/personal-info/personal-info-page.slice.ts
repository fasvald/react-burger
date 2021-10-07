/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

import { API_ENDPOINTS } from '../../../common/constants/api.constant'
import { IAuthUser, IProfileResponse } from '../../../common/models/auth.model'
import { TFetchProcess } from '../../../common/models/data.model'
import { IAxiosSerializedError, IUnknownDefaultError } from '../../../common/models/errors.model'
import { getSerializedAxiosError } from '../../../common/utils/errors.utils'
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

export const updateProfile = createAsyncThunk<
  IProfileResponse,
  IAuthUser,
  {
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>('profile/patch', async (data: IAuthUser, thunkApi) => {
  try {
    const source = axios.CancelToken.source()
    thunkApi.signal.addEventListener('abort', () => {
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
      return thunkApi.rejectWithValue('Personal info update stop the work. This has been aborted!')
    }

    if (axios.isAxiosError(err)) {
      return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
    }

    return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
  }
})

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
