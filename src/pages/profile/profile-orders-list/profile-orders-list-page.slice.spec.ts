import { AnyAction, createAction, PayloadAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { IOrdersResponse } from '@common/models/orders.model'
import { mocks } from '@mocks/mocks'
import { getUsersOrders } from '@services/slices/orders.slice'
import { RootState } from '@store'

import reducer, {
  IProfileOrdersListPageState,
  ordersFetchStatusSelector,
  ordersSelector,
  ordersTotalCountSelector,
  ordersTotalTodayCountSelector,
  selectOrdersByStatus,
  updateOrders,
} from './profile-orders-list-page.slice'

const initialState: IProfileOrdersListPageState = {
  status: 'idle',
  orders: [],
  total: null,
  totalToday: null,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Profile Orders List Page Slice', () => {
  describe('Selectors', () => {
    test('should select "status" in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ profileOrdersListPage: state })
      const status = ordersFetchStatusSelector(store.getState() as RootState)

      expect(status).toEqual(initialState.status)
    })

    test('should select "orders" in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ profileOrdersListPage: state })
      const orders = ordersSelector(store.getState() as RootState)

      expect(orders).toEqual(initialState.orders)
    })

    test('should select "total" in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ profileOrdersListPage: state })
      const total = ordersTotalCountSelector(store.getState() as RootState)

      expect(total).toEqual(initialState.total)
    })

    test('should select "totalToday" in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ profileOrdersListPage: state })
      const totalToday = ordersTotalTodayCountSelector(store.getState() as RootState)

      expect(totalToday).toEqual(initialState.totalToday)
    })

    test('should select orders by "done" status in state from store correctly', () => {
      const state = reducer(
        { ...initialState, orders: mocks.ordersAll.response.orders },
        {} as AnyAction,
      )
      const store = mockStore({ profileOrdersListPage: state })

      expect(selectOrdersByStatus(store.getState() as RootState)('done')).toEqual(
        mocks.ordersAll.response.orders.filter((order) => order.status === 'done'),
      )
    })

    test('should select orders by "pending" status in state from store correctly', () => {
      const state = reducer(
        { ...initialState, orders: mocks.ordersAll.response.orders },
        {} as AnyAction,
      )
      const store = mockStore({ profileOrdersListPage: state })

      expect(selectOrdersByStatus(store.getState() as RootState)('pending')).toEqual(
        mocks.ordersAll.response.orders.filter((order) => order.status === 'pending'),
      )
    })
  })

  describe('Actions', () => {
    test(`should create "${updateOrders.type}" when save orders info chunk`, () => {
      const expectedAction: PayloadAction<{ data: IOrdersResponse }> = {
        type: updateOrders.type,
        payload: {
          data: mocks.ordersUser.response,
        },
      }

      expect(updateOrders({ data: mocks.ordersUser.response })).toEqual(expectedAction)
    })
  })

  describe('Reducer', () => {
    const updatedState = {
      orders: mocks.ordersUser.response.orders,
      total: mocks.ordersUser.response.total,
      totalToday: mocks.ordersUser.response.totalToday,
    }

    // NOTE: Based on https://stackoverflow.com/a/62683923/4606887
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IProfileOrdersListPageState>(initialState)
    })

    test('should handle an orders being updated in state', () => {
      expect(
        reducer(initialState, updateOrders({ data: mocks.ordersUser.response })),
      ).toEqual<IProfileOrdersListPageState>({
        status: 'idle',
        ...updatedState,
      })
    })

    test('should handle fetching status being set to "loading"', () => {
      const state = reducer(initialState, createAction(getUsersOrders.pending.type))
      expect(state).toEqual<IProfileOrdersListPageState>({ ...initialState, status: 'loading' })
    })

    test('should handle fetching status and orders info being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<IOrdersResponse>(getUsersOrders.fulfilled.type)(mocks.ordersUser.response),
      )
      expect(state).toEqual<IProfileOrdersListPageState>({ ...updatedState, status: 'loaded' })
    })

    test('should handle fetching status being set to "error"', () => {
      const state = reducer(initialState, createAction(getUsersOrders.rejected.type))
      expect(state).toEqual<IProfileOrdersListPageState>({ ...initialState, status: 'error' })
    })
  })
})
