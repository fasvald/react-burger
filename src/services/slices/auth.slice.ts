/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IAuthPayloadActionData, IAuthState } from '../../common/models/auth.model'
import { RootState } from '../../store'

const initialState: IAuthState = {
  isLoggedIn: false,
  user: null,
  accessToken: null,
  refreshToken: null,
}

export const authSelector = (state: RootState): IAuthState => state.auth

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveAuthorizedUser: (state, action: PayloadAction<IAuthPayloadActionData>) => {
      const { user, accessToken, refreshToken } = action.payload

      state.isLoggedIn = true
      state.user = user
      state.accessToken = accessToken
      state.refreshToken = refreshToken
    },
    clearAuthorizedUser: (state, action) => {
      state.isLoggedIn = false
      state.user = null
      state.accessToken = null
      state.refreshToken = null
    },
  },
})

export const { saveAuthorizedUser, clearAuthorizedUser } = authSlice.actions

export default authSlice.reducer
