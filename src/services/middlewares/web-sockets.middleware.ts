import { IOrdersResponse } from '@common/models/orders.model'
import {
  wsConnect,
  wsDisconnect,
  wsOnClose,
  wsOnError,
  wsOnOpen,
} from '@services/slices/web-sockets.slice'
import { AppDispatch, RootState } from '@store'

import type { Middleware, MiddlewareAPI } from 'redux'

const socketHandler: Middleware = (storeAPI: MiddlewareAPI<AppDispatch, RootState>) => {
  let socket: WebSocket | null = null
  let onMessageActionType: string | null = null
  let url: string | null = null

  return (next) => (action) => {
    const { dispatch } = storeAPI
    const { payload } = action

    if (wsConnect.match(action)) {
      if (socket) {
        socket.close()
      }

      socket = new WebSocket(payload.url)
      onMessageActionType = payload.onMessageActionType
      url = payload.url
    }

    if (wsDisconnect.match(action) && socket) {
      socket.close()
    }

    if (wsOnClose.match(action) && socket) {
      socket = null
      onMessageActionType = null
      url = null
    }

    if (socket) {
      socket.onopen = (event: Event) => {
        dispatch(wsOnOpen())
      }

      socket.onerror = (event: Event) => {
        dispatch(
          wsOnError({ error: new Error(`Web socket error using url:"${url || ''}"`).message }),
        )
      }

      socket.onclose = (event: CloseEvent) => {
        dispatch(wsOnClose())
      }

      socket.onmessage = (event: MessageEvent) => {
        const data: IOrdersResponse = JSON.parse(event.data)
        const { orders, total, totalToday } = data

        dispatch({ type: onMessageActionType, payload: { data: { orders, total, totalToday } } })
      }
    }

    return next(action)
  }
}

export default socketHandler
