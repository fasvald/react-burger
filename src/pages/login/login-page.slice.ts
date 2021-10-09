/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit'

import { TSignInResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/fetch-process.model'
import { signIn } from '../../services/slices/auth.slice'
import { RootState } from '../../store'

interface ILoginPageState {
  status: TFetchProcess
  res: TSignInResponse | null
}

const initialState: ILoginPageState = {
  status: 'idle',
  res: null,
}

export const signInStatusSelector = (state: RootState): TFetchProcess => state.loginPage.status

export const loginPageSlice = createSlice({
  name: 'loginPage',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(signIn.pending, (state) => {
      state.status = 'loading'
      state.res = null
    })
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.res = action.payload
    })
    builder.addCase(signIn.rejected, (state) => {
      state.status = 'error'
      state.res = null
    })
  },
})

export default loginPageSlice.reducer
