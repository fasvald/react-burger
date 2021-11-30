import { PayloadAction } from '@reduxjs/toolkit'
import WS from 'jest-websocket-mock'
import { AnyAction, MiddlewareAPI } from 'redux'

import { wsConnectPayloadMock } from '@mocks/mocks'
import {
  wsConnect,
  wsDisconnect,
  wsOnClose,
  wsOnError,
  wsOnOpen,
} from '@services/slices/web-sockets.slice'

import socketHandler from './web-sockets.middleware'

/**
 * NOTE: Tests are based on:
 * 1) https://github.com/mrdulin/jest-codelab/blob/master/src/stackoverflow/59754838/api.middleware.ts
 * 2) https://github.com/mrdulin/jest-codelab/blob/master/src/stackoverflow/59754838/api.middleware.test.ts
 * 3) https://www.npmjs.com/package/jest-websocket-mock
 * 4) https://redux.js.org/usage/writing-tests#middleware
 */

const create = () => {
  const store: MiddlewareAPI = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  }

  const next = jest.fn()

  const invoke = (action: AnyAction | PayloadAction) => socketHandler(store)(next)(action)

  return { store, next, invoke }
}

describe('Web Sockets Middleware', () => {
  const fakeURL = 'ws://localhost:8080'

  describe('"Controllers" Actions', () => {
    test(`should pass dispatch web socket "${wsConnect.type}" action`, async () => {
      const { next, invoke } = create()

      invoke(wsConnect({ ...wsConnectPayloadMock, url: fakeURL }))

      expect(next).toBeCalledWith(wsConnect({ ...wsConnectPayloadMock, url: fakeURL }))
    })

    test(`should pass dispatch web socket "${wsDisconnect.type}" action`, async () => {
      const { next, invoke } = create()

      invoke(wsDisconnect())

      expect(next).toBeCalledWith(wsDisconnect())
    })
  })

  describe('Socket "On Events" Actions', () => {
    // NOTE: Default before all, etc won't work because of weird logic of ws mock lib API, it won't work correctly until u
    // established client connection
    it(`should pass dispatch web socket on open event "${wsOnOpen.type}" action`, async () => {
      const { store, invoke } = create()
      const server = new WS(fakeURL)

      invoke(wsConnect({ ...wsConnectPayloadMock, url: fakeURL }))

      await server.connected

      expect(store.dispatch).toBeCalledWith(wsOnOpen())

      server.close()
    }, 30000)

    it(`should pass dispatch web socket on close event "${wsOnClose.type}" action`, async () => {
      const { store, invoke } = create()
      const server = new WS(fakeURL)

      invoke(wsConnect({ ...wsConnectPayloadMock, url: fakeURL }))

      await server.connected

      server.close()

      expect(store.dispatch).toBeCalledWith(wsOnClose())
    }, 30000)

    it(`should pass dispatch web socket on error event "${wsOnError.type}" action`, async () => {
      const { store, invoke } = create()
      const server = new WS(fakeURL)

      invoke(wsConnect({ ...wsConnectPayloadMock, url: fakeURL }))

      await server.connected

      server.error()

      expect(store.dispatch).toBeCalledWith(
        wsOnError({ error: new Error(`Web socket error using url:"${fakeURL || ''}"`).message }),
      )

      server.close()
    }, 30000)

    it('should pass dispatch web socket on message custom event action', async () => {
      const { store, invoke } = create()
      const server = new WS(fakeURL)

      invoke(wsConnect({ ...wsConnectPayloadMock, url: fakeURL }))

      await server.connected

      server.send('{"orders":[],"total":1,"totalToday":1}')

      expect(store.dispatch).toBeCalledWith(wsOnOpen())
      expect(store.dispatch).toBeCalledWith({
        type: wsConnectPayloadMock.onMessageActionType,
        payload: { data: { orders: [], total: 1, totalToday: 1 } },
      })

      server.close()
    }, 30000)
  })
})
