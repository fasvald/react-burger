/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IWSState {
  connected: boolean
  url: string | null
  error?: string
}

const initialState: IWSState = {
  connected: false,
  url: null,
  error: undefined,
}

const wsSlice = createSlice({
  name: 'webSocket',
  initialState,
  reducers: {
    wsConnect(
      state,
      action: PayloadAction<{
        url: string
        onMessageActionType: string
      }>,
    ) {
      state.connected = false
      state.url = action.payload.url
      state.error = undefined
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    wsDisconnect(state) {},
    //
    wsOnOpen(state) {
      state.connected = true
    },
    wsOnError(state, action: PayloadAction<{ error: string }>) {
      state.connected = false
      state.error = action.payload.error
    },
    wsOnClose(state) {
      state.connected = false
      state.url = null
      state.error = undefined
    },
  },
})

export const { wsConnect, wsDisconnect, wsOnOpen, wsOnError, wsOnClose } = wsSlice.actions

export default wsSlice.reducer
