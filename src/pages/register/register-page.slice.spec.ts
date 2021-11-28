import { AnyAction, createAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { TSignUpResponse } from '@common/models/auth.model'
import { mocks } from '@mocks/mocks'
import { signUp } from '@services/slices/auth.slice'
import { RootState } from '@store'

import reducer, { IRegisterPageState, signUpStatusSelector } from './register-page.slice'

const initialState: IRegisterPageState = {
  status: 'idle',
  res: null,
}
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Login Page Slice', () => {
  describe('Selectors', () => {
    test('should select "status" in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ registerPage: state })
      const status = signUpStatusSelector(store.getState() as RootState)

      expect(status).toEqual(initialState.status)
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IRegisterPageState>(initialState)
    })

    test('should handle fetching status being set to "loading"', () => {
      const state = reducer(initialState, createAction(signUp.pending.type))
      expect(state).toEqual<IRegisterPageState>({ ...initialState, status: 'loading' })
    })

    test('should handle fetching status and login info being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<TSignUpResponse>(signUp.fulfilled.type)(mocks.signUp.response),
      )
      expect(state).toEqual<IRegisterPageState>({ status: 'loaded', res: mocks.signIn.response })
    })

    test('should handle fetching status being set to "error"', () => {
      const state = reducer(initialState, createAction(signUp.rejected.type))
      expect(state).toEqual<IRegisterPageState>({ ...initialState, status: 'error' })
    })
  })
})
