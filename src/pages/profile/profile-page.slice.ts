/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit'

import { ISignOutResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/fetch-process.model'
import { signOut } from '../../services/slices/auth.slice'
import { RootState } from '../../store'

interface IProfilePageState {
  signOutStatus: TFetchProcess
  res: ISignOutResponse | null
}

const initialState: IProfilePageState = {
  signOutStatus: 'idle',
  res: null,
}

export const signOutStatusSelector = (state: RootState): TFetchProcess =>
  state.profilePage.signOutStatus

const profilePageSlice = createSlice({
  name: 'profilePage',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(signOut.pending, (state) => {
      state.signOutStatus = 'loading'
      state.res = null
    })
    builder.addCase(signOut.fulfilled, (state, action) => {
      state.signOutStatus = 'loaded'
      state.res = action.payload
    })
    builder.addCase(signOut.rejected, (state) => {
      state.signOutStatus = 'error'
      state.res = null
    })
  },
})

export default profilePageSlice.reducer
