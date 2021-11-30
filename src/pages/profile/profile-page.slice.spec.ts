import { AnyAction, createAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { ISignOutResponse } from '@common/models/auth.model'
import { mocks } from '@mocks/mocks'
import { signOut } from '@services/slices/auth.slice'
import { RootState } from '@store'

import reducer, { IProfilePageState, signOutStatusSelector } from './profile-page.slice'

const initialState: IProfilePageState = {
  signOutStatus: 'idle',
  res: null,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Profile Page Slice', () => {
  describe('Selectors', () => {
    test('should select "status" in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ profilePage: state })
      const status = signOutStatusSelector(store.getState() as RootState)

      expect(status).toEqual(initialState.signOutStatus)
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IProfilePageState>(initialState)
    })

    test('should handle fetching status being set to "loading"', () => {
      const state = reducer(initialState, createAction(signOut.pending.type))
      expect(state).toEqual<IProfilePageState>({ ...initialState, signOutStatus: 'loading' })
    })

    test('should handle fetching status and login info being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<ISignOutResponse>(signOut.fulfilled.type)(mocks.signOut.response),
      )
      expect(state).toEqual<IProfilePageState>({
        signOutStatus: 'loaded',
        res: mocks.signOut.response,
      })
    })

    test('should handle fetching status being set to "error"', () => {
      const state = reducer(initialState, createAction(signOut.rejected.type))
      expect(state).toEqual<IProfilePageState>({ ...initialState, signOutStatus: 'error' })
    })
  })
})
