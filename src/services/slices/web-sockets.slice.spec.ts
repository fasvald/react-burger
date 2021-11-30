import { Action, AnyAction, PayloadAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { wsConnectPayloadMock, wsOnErrorPayloadMock } from '@mocks/mocks'

import reducer, {
  IWSState,
  wsConnect,
  wsDisconnect,
  wsOnClose,
  wsOnError,
  wsOnOpen,
} from './web-sockets.slice'

const initialState: IWSState = {
  connected: false,
  url: null,
  error: undefined,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('WebSocket Slice', () => {
  describe('Actions', () => {
    test(`should create '${wsConnect.type}' when web socket setups`, () => {
      const expectedAction: PayloadAction<{
        url: string
        onMessageActionType: string
      }> = {
        type: wsConnect.type,
        payload: wsConnectPayloadMock,
      }

      expect(wsConnect(wsConnectPayloadMock)).toEqual(expectedAction)
    })

    test(`should create '${wsDisconnect.type}' when trigger web socket disconnection`, () => {
      const expectedAction: AnyAction = {
        type: wsDisconnect.type,
      }

      expect(wsDisconnect()).toEqual(expectedAction)
    })

    test(`should create '${wsOnOpen.type}' when web socket connection is ready`, () => {
      const expectedAction: Action = {
        type: wsOnOpen.type,
      }

      expect(wsOnOpen()).toEqual(expectedAction)
    })

    test(`should create '${wsOnError.type}' when web socket connection error occurs`, () => {
      const expectedAction: PayloadAction<{ error: string }> = {
        type: wsOnError.type,
        payload: wsOnErrorPayloadMock,
      }

      expect(wsOnError(wsOnErrorPayloadMock)).toEqual(expectedAction)
    })

    test(`should create '${wsOnClose.type}' when web socket connection is closed`, () => {
      const expectedAction: Action = {
        type: wsOnClose.type,
      }

      expect(wsOnClose()).toEqual(expectedAction)
    })
  })

  describe('Reducer', () => {
    const updatedState: IWSState = {
      connected: false,
      url: wsConnectPayloadMock.url,
      error: undefined,
    }

    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IWSState>(initialState)
    })

    test('should handle connection info being added on web socket setup', () => {
      expect(reducer(initialState, wsConnect(wsConnectPayloadMock))).toEqual<IWSState>(updatedState)
    })

    test('should handle connection status being changed on successful connection', () => {
      expect(reducer(updatedState, wsOnOpen())).toEqual<IWSState>({
        ...updatedState,
        connected: true,
      })
    })

    test('should handle connection status and error being changed on connection error', () => {
      expect(reducer(updatedState, wsOnError(wsOnErrorPayloadMock))).toEqual<IWSState>({
        ...updatedState,
        connected: false,
        error: wsOnErrorPayloadMock.error,
      })
    })

    test('should handle connection info being changed on connection close', () => {
      expect(reducer(updatedState, wsOnClose())).toEqual<IWSState>(initialState)
    })
  })
})
