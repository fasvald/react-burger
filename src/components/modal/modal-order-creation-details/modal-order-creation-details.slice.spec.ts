import { AnyAction, createAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { IAxiosSerializedError } from '@common/models/errors.model'
import { orderCreationErrorHandler } from '@mocks/handlers'
import { mocks } from '@mocks/mocks'
import { server } from '@mocks/server'
import { AppDispatch, RootState } from '@store'

import { IOrderDetailsResponse, IOrderDetailsState } from './modal-order-creation-details.model'
import reducer, {
  checkoutOrder,
  orderCreationStatusSelector,
  orderSelector,
} from './modal-order-creation-details.slice'

const initialState: IOrderDetailsState = {
  status: 'idle',
  order: null,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Modal Order Creation Details Slice', () => {
  describe('Selectors', () => {
    test('should select order details from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ orderCreationDetails: state })
      const orderDetails = orderSelector(store.getState() as RootState)

      expect(orderDetails).toEqual(initialState.order)
    })

    test('should select order details fetch status from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ orderCreationDetails: state })
      const status = orderCreationStatusSelector(store.getState() as RootState)

      expect(status).toEqual(initialState.status)
    })
  })

  describe('Async Actions', () => {
    // Enable API mocking before tests
    beforeAll(() => server.listen())

    // Reset any runtime request handlers we may add during the tests
    afterEach(() => server.resetHandlers())

    // Disable API mocking after the tests are done
    afterAll(() => server.close())

    describe(`'${checkoutOrder.typePrefix}' action`, () => {
      test(`should create '${checkoutOrder.fulfilled.type}' when send & receive order`, async () => {
        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
        } = await dispatch(checkoutOrder(mocks.orderCreate.requestBody))

        const expectedActions = [
          checkoutOrder.pending(requestId, mocks.orderCreate.requestBody),
          checkoutOrder.fulfilled(
            mocks.orderCreate.response,
            requestId,
            mocks.orderCreate.requestBody,
          ),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)

      test(`should create '${checkoutOrder.rejected.type}' when send & failed to receive order`, async () => {
        server.use(orderCreationErrorHandler)

        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
          payload,
        } = await dispatch(checkoutOrder(mocks.orderCreate.requestBody))

        const expectedActions = [
          checkoutOrder.pending(requestId, mocks.orderCreate.requestBody),
          checkoutOrder.rejected(
            null,
            requestId,
            mocks.orderCreate.requestBody,
            payload as IAxiosSerializedError,
          ),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IOrderDetailsState>(initialState)
    })

    test('should handle fetching status being set to "loading"', () => {
      const state = reducer(initialState, createAction(checkoutOrder.pending.type))
      expect(state).toEqual<IOrderDetailsState>({ ...initialState, status: 'loading' })
    })

    test('should handle order creation status and details info being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<IOrderDetailsResponse>(checkoutOrder.fulfilled.type)(
          mocks.orderCreate.response,
        ),
      )
      expect(state).toEqual<IOrderDetailsState>({
        status: 'loaded',
        order: mocks.orderCreate.response,
      })
    })

    test('should handle fetching status being set to "error"', () => {
      const state = reducer(initialState, createAction(checkoutOrder.rejected.type))
      expect(state).toEqual<IOrderDetailsState>({ ...initialState, status: 'error' })
    })
  })
})
