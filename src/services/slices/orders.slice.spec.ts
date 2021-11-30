import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { IAxiosSerializedError } from '@common/models/errors.model'
import {
  orderByNumberErrorHandler,
  ordersAllErrorHandler,
  ordersUsersErrorHandler,
} from '@mocks/handlers'
import { mocks } from '@mocks/mocks'
import { server } from '@mocks/server'
import { AppDispatch } from '@store'

import { getAllOrders, getOrderByNumber, getUsersOrders } from './orders.slice'

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Orders Slice', () => {
  describe('Async Actions', () => {
    // Enable API mocking before tests
    beforeAll(() => server.listen())

    // Reset any runtime request handlers we may add during the tests
    afterEach(() => server.resetHandlers())

    // Disable API mocking after the tests are done
    afterAll(() => server.close())

    describe(`'${getAllOrders.typePrefix}' action`, () => {
      test(`should create '${getAllOrders.fulfilled.type}' when fetch & receive all orders`, async () => {
        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
        } = await dispatch(getAllOrders())

        const expectedActions = [
          getAllOrders.pending(requestId, undefined),
          getAllOrders.fulfilled(mocks.ordersAll.response, requestId, undefined),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)

      test(`should create '${getAllOrders.rejected.type}' when fetch & failed to receive all orders`, async () => {
        server.use(ordersAllErrorHandler)

        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
          payload,
        } = await dispatch(getAllOrders())

        const expectedActions = [
          getAllOrders.pending(requestId, undefined),
          getAllOrders.rejected(null, requestId, undefined, payload as IAxiosSerializedError),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)
    })

    describe(`'${getUsersOrders.typePrefix}' action`, () => {
      test(`should create '${getAllOrders.fulfilled.type}' when fetch & receive all orders`, async () => {
        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
        } = await dispatch(getUsersOrders(true))

        const expectedActions = [
          getUsersOrders.pending(requestId, true),
          getUsersOrders.fulfilled(mocks.orders.response, requestId, true),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)

      test(`should create '${getUsersOrders.rejected.type}' when fetch & failed to receive all orders`, async () => {
        server.use(ordersUsersErrorHandler)

        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
          payload,
        } = await dispatch(getUsersOrders(true))

        const expectedActions = [
          getUsersOrders.pending(requestId, true),
          getUsersOrders.rejected(null, requestId, true, payload as IAxiosSerializedError),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)
    })

    describe(`'${getOrderByNumber.typePrefix}' action`, () => {
      test(`should create '${getOrderByNumber.fulfilled.type}' when fetch & receive all orders`, async () => {
        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
        } = await dispatch(getOrderByNumber(mocks.orderByNumber.requestBody))

        const expectedActions = [
          getOrderByNumber.pending(requestId, mocks.orderByNumber.requestBody),
          getOrderByNumber.fulfilled(
            mocks.orderByNumber.response.orders[0],
            requestId,
            mocks.orderByNumber.requestBody,
          ),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)

      test(`should create '${getOrderByNumber.rejected.type}' when fetch & failed to receive all orders`, async () => {
        server.use(orderByNumberErrorHandler)

        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
          payload,
        } = await dispatch(getOrderByNumber(mocks.orderByNumber.requestBody))

        const expectedActions = [
          getOrderByNumber.pending(requestId, mocks.orderByNumber.requestBody),
          getOrderByNumber.rejected(
            null,
            requestId,
            mocks.orderByNumber.requestBody,
            payload as IAxiosSerializedError,
          ),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)
    })
  })
})
