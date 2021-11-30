import { AnyAction, createAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { TSignInResponse } from '@common/models/auth.model'
import { mocks } from '@mocks/mocks'
import { signIn } from '@services/slices/auth.slice'
import { RootState } from '@store'

import reducer, { ILoginPageState, signInStatusSelector } from './login-page.slice'

const initialState: ILoginPageState = {
  status: 'idle',
  res: null,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Login Page Slice', () => {
  describe('Selectors', () => {
    test('should select "status" in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ loginPage: state })
      const status = signInStatusSelector(store.getState() as RootState)

      expect(status).toEqual(initialState.status)
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<ILoginPageState>(initialState)
    })

    test('should handle fetching status being set to "loading"', () => {
      const state = reducer(initialState, createAction(signIn.pending.type))
      expect(state).toEqual<ILoginPageState>({ ...initialState, status: 'loading' })
    })

    test('should handle fetching status and login info being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<TSignInResponse>(signIn.fulfilled.type)(mocks.signIn.response),
      )
      expect(state).toEqual<ILoginPageState>({ status: 'loaded', res: mocks.signIn.response })
    })

    test('should handle fetching status being set to "error"', () => {
      const state = reducer(initialState, createAction(signIn.rejected.type))
      expect(state).toEqual<ILoginPageState>({ ...initialState, status: 'error' })
    })
  })
})
