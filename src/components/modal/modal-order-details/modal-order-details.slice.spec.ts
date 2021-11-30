import { AnyAction, createAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { IOrder } from '@common/models/orders.model'
import { mocks } from '@mocks/mocks'
import feedPageReducer from '@pages/feed/feed-page.slice'
import profileOrdersListPageReducer from '@pages/profile/profile-orders-list/profile-orders-list-page.slice'
import { getOrderByNumber } from '@services/slices/orders.slice'
import { RootState } from '@store'

import reducer, {
  chosenOrderDetailsSelector,
  IModalOrderDetailsState,
  orderByNumberFetchingSelector,
  ordersAllOrUsersSelector,
  removeOrderDetails,
  saveOrderDetails,
  selectChosenOrder,
} from './modal-order-details.slice'

const initialState: IModalOrderDetailsState = {
  order: null,
  status: 'idle',
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Modal Order Details Slice', () => {
  describe('Selectors', () => {
    test('should select order details from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ orderDetails: state })
      const order = chosenOrderDetailsSelector(store.getState() as RootState)

      expect(order).toEqual(initialState.order)
    })

    test('should select order details fetch status from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ orderDetails: state })
      const status = orderByNumberFetchingSelector(store.getState() as RootState)

      expect(status).toEqual(initialState.status)
    })

    test('should select all orders from store correctly', () => {
      const orderDetailsState = reducer(initialState, {} as AnyAction)
      const feedPageState = feedPageReducer(
        {
          status: 'loaded',
          orders: mocks.ordersAll.response.orders,
          total: mocks.ordersAll.response.total,
          totalToday: mocks.ordersAll.response.totalToday,
        },
        {} as AnyAction,
      )
      const profileOrdersPageState = profileOrdersListPageReducer(
        {
          status: 'loaded',
          orders: mocks.ordersUser.response.orders,
          total: mocks.ordersUser.response.total,
          totalToday: mocks.ordersUser.response.totalToday,
        },
        {} as AnyAction,
      )

      const store = mockStore({
        orderDetails: orderDetailsState,
        feedPage: feedPageState,
        profileOrdersListPage: profileOrdersPageState,
      })

      expect(ordersAllOrUsersSelector(store.getState() as RootState)(false)).toEqual(
        mocks.ordersAll.response.orders,
      )
    })

    test('should select all user orders from store correctly', () => {
      const orderDetailsState = reducer(initialState, {} as AnyAction)
      const feedPageState = feedPageReducer(
        {
          status: 'loaded',
          orders: mocks.ordersAll.response.orders,
          total: mocks.ordersAll.response.total,
          totalToday: mocks.ordersAll.response.totalToday,
        },
        {} as AnyAction,
      )
      const profileOrdersPageState = profileOrdersListPageReducer(
        {
          status: 'loaded',
          orders: mocks.ordersUser.response.orders,
          total: mocks.ordersUser.response.total,
          totalToday: mocks.ordersUser.response.totalToday,
        },
        {} as AnyAction,
      )

      const store = mockStore({
        orderDetails: orderDetailsState,
        feedPage: feedPageState,
        profileOrdersListPage: profileOrdersPageState,
      })

      expect(ordersAllOrUsersSelector(store.getState() as RootState)(true)).toEqual(
        mocks.ordersUser.response.orders,
      )
    })

    test('should select chosen order from store correctly', () => {
      const orderDetailsState = reducer(
        {
          status: 'loaded',
          order: mocks.ordersUser.response.orders[0],
        },
        {} as AnyAction,
      )
      const feedPageState = feedPageReducer(
        {
          status: 'loaded',
          orders: mocks.ordersAll.response.orders,
          total: mocks.ordersAll.response.total,
          totalToday: mocks.ordersAll.response.totalToday,
        },
        {} as AnyAction,
      )
      const profileOrdersPageState = profileOrdersListPageReducer(
        {
          status: 'loaded',
          orders: mocks.ordersUser.response.orders,
          total: mocks.ordersUser.response.total,
          totalToday: mocks.ordersUser.response.totalToday,
        },
        {} as AnyAction,
      )

      const store = mockStore({
        orderDetails: orderDetailsState,
        feedPage: feedPageState,
        profileOrdersListPage: profileOrdersPageState,
      })

      expect(
        selectChosenOrder(store.getState() as RootState)(
          mocks.ordersUser.response.orders[0].number,
          false,
        ),
      ).toEqual(mocks.ordersUser.response.orders[0])
    })
  })

  describe('Actions', () => {
    test(`should create "${saveOrderDetails.type}" when save order details`, () => {
      expect(saveOrderDetails(mocks.ordersAll.response.orders[0])).toEqual(
        createAction<IOrder>(saveOrderDetails.type)(mocks.ordersAll.response.orders[0]),
      )
    })

    test(`should create "${removeOrderDetails.type}" when remove order details`, () => {
      expect(removeOrderDetails()).toEqual(createAction(removeOrderDetails.type)())
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IModalOrderDetailsState>(initialState)
    })

    test('should handle an order details being updated in state', () => {
      expect(
        reducer(initialState, saveOrderDetails(mocks.ordersAll.response.orders[0])),
      ).toEqual<IModalOrderDetailsState>({
        status: 'idle',
        order: mocks.ordersAll.response.orders[0],
      })
    })

    test('should handle an order details being removed from state', () => {
      expect(
        reducer(
          { status: 'idle', order: mocks.ordersAll.response.orders[0] },
          removeOrderDetails(),
        ),
      ).toEqual<IModalOrderDetailsState>({
        status: 'idle',
        order: null,
      })
    })

    test('should handle fetching status being set to "loading"', () => {
      const state = reducer(initialState, createAction(getOrderByNumber.pending.type))
      expect(state).toEqual<IModalOrderDetailsState>({ ...initialState, status: 'loading' })
    })

    test('should handle fetching order details and status being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<IOrder>(getOrderByNumber.fulfilled.type)(mocks.ordersAll.response.orders[0]),
      )
      expect(state).toEqual<IModalOrderDetailsState>({
        status: 'loaded',
        order: mocks.ordersAll.response.orders[0],
      })
    })

    test('should handle fetching status being set to "error"', () => {
      const state = reducer(initialState, createAction(getOrderByNumber.rejected.type))
      expect(state).toEqual<IModalOrderDetailsState>({ ...initialState, status: 'error' })
    })
  })
})
