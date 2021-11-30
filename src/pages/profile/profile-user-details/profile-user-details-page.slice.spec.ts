import { AnyAction, createAction, PayloadAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { IProfileResponse } from '@common/models/auth.model'
import { IOrdersResponse } from '@common/models/orders.model'
import { mocks } from '@mocks/mocks'
import { getUser, updateUser } from '@services/slices/user.slice'
import { RootState } from '@store'

import reducer, {
  fetchUserStatusSelector,
  IUserDetailsPageState,
  updateUserStatusSelector,
} from './profile-user-details-page.slice'

const initialState: IUserDetailsPageState = {
  fetch: {
    status: 'idle',
    res: null,
  },
  update: {
    status: 'idle',
    res: null,
  },
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Profile User Details Page Slice', () => {
  describe('Selectors', () => {
    test('should select user fetch "status" in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ profileUserDetailsPage: state })
      const status = fetchUserStatusSelector(store.getState() as RootState)

      expect(status).toEqual(initialState.fetch.status)
    })

    test('should select user update "status" in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ profileUserDetailsPage: state })
      const status = updateUserStatusSelector(store.getState() as RootState)

      expect(status).toEqual(initialState.update.status)
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IUserDetailsPageState>(initialState)
    })

    test('should handle fetching status being set to "loading"', () => {
      const state = reducer(initialState, createAction(getUser.pending.type))
      expect(state).toEqual<IUserDetailsPageState>({
        ...initialState,
        fetch: {
          ...initialState.fetch,
          status: 'loading',
        },
      })
    })

    test('should handle fetching status and user info being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<IProfileResponse>(getUser.fulfilled.type)(mocks.profile.response),
      )
      expect(state).toEqual<IUserDetailsPageState>({
        ...initialState,
        fetch: {
          status: 'loaded',
          res: mocks.profile.response,
        },
      })
    })

    test('should handle fetching status being set to "error"', () => {
      const state = reducer(initialState, createAction(getUser.rejected.type))
      expect(state).toEqual<IUserDetailsPageState>({
        ...initialState,
        fetch: {
          ...initialState.fetch,
          status: 'error',
        },
      })
    })

    test('should handle update fetch status being set to "loading"', () => {
      const state = reducer(initialState, createAction(updateUser.pending.type))
      expect(state).toEqual<IUserDetailsPageState>({
        ...initialState,
        update: {
          ...initialState.update,
          status: 'loading',
        },
      })
    })

    test('should handle update fetch status and user info being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<IProfileResponse>(updateUser.fulfilled.type)(mocks.profile.response),
      )
      expect(state).toEqual<IUserDetailsPageState>({
        ...initialState,
        update: {
          status: 'loaded',
          res: mocks.profile.response,
        },
      })
    })

    test('should handle update fetch status being set to "error"', () => {
      const state = reducer(initialState, createAction(updateUser.rejected.type))
      expect(state).toEqual<IUserDetailsPageState>({
        ...initialState,
        update: {
          ...initialState.fetch,
          status: 'error',
        },
      })
    })
  })
})
