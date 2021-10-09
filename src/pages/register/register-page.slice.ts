/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit'

import { TSignUpResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/fetch-process.model'
import { signUp } from '../../services/slices/auth.slice'
import { RootState } from '../../store'

interface IRegisterPageState {
  status: TFetchProcess
  res: TSignUpResponse | null
}

const initialState: IRegisterPageState = {
  status: 'idle',
  res: null,
}

export const signUpStatusSelector = (state: RootState): TFetchProcess => state.registerPage.status

export const registerPageSlice = createSlice({
  name: 'registerPage',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(signUp.pending, (state) => {
      state.status = 'loading'
      state.res = null
    })
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.res = action.payload
    })
    builder.addCase(signUp.rejected, (state) => {
      state.status = 'error'
      state.res = null
    })
  },
})

export default registerPageSlice.reducer
