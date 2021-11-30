/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit'

import { IProfileResponse } from '@common/models/auth.model'
import { TFetchProcess } from '@common/models/fetch-process.model'
import { getUser, updateUser } from '@services/slices/user.slice'
import { RootState } from '@store'

export interface IUserDetailsPageState {
  fetch: {
    status: TFetchProcess
    res: IProfileResponse | null
  }
  update: {
    status: TFetchProcess
    res: IProfileResponse | null
  }
}

const initialState: IUserDetailsPageState = {
  fetch: {
    status: 'idle',
    res: null,
  },
  update: {
    status: 'idle',
    res: null,
  },
}

export const fetchUserStatusSelector = (state: RootState): TFetchProcess =>
  state.profileUserDetailsPage.fetch.status

export const updateUserStatusSelector = (state: RootState): TFetchProcess =>
  state.profileUserDetailsPage.update.status

const profileUserDetailsPageSlice = createSlice({
  name: 'userDetailsPage',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUser.pending, (state) => {
      state.fetch.status = 'loading'
      state.fetch.res = null
    })
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.fetch.status = 'loaded'
      state.fetch.res = action.payload
    })
    builder.addCase(getUser.rejected, (state, action) => {
      state.fetch.status = 'error'
      state.fetch.res = null
    })
    builder.addCase(updateUser.pending, (state, action) => {
      state.update.status = 'loading'
      state.update.res = null
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.update.status = 'loaded'
      state.update.res = action.payload
    })
    builder.addCase(updateUser.rejected, (state, action) => {
      state.update.status = 'error'
      state.update.res = null
    })
  },
})

export default profileUserDetailsPageSlice.reducer
