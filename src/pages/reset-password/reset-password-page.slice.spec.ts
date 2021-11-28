import { createAction } from '@reduxjs/toolkit'
import { AnyAction } from 'redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { TPasswordForgotResponse } from '@common/models/auth.model'
import { IAxiosSerializedError } from '@common/models/errors.model'
import { resetPasswordErrorHandler } from '@mocks/handlers'
import { mocks } from '@mocks/mocks'
import { server } from '@mocks/server'
import { AppDispatch, RootState } from '@store'

import reducer, {
  IResetPasswordPageState,
  resetPassword,
  resetPasswordStatusSelector,
} from './reset-password-page.slice'

const initialState: IResetPasswordPageState = {
  status: 'idle',
  res: null,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Reset Password Page Slice', () => {
  describe('Selectors', () => {
    test('should select status state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ resetPasswordPage: state })
      const status = resetPasswordStatusSelector(store.getState() as RootState)

      expect(status).toEqual(initialState.status)
    })
  })

  describe('Async actions', () => {
    // Enable API mocking before tests
    beforeAll(() => server.listen())

    // Reset any runtime request handlers we may add during the tests
    afterEach(() => server.resetHandlers())

    // Disable API mocking after the tests are done
    afterAll(() => server.close())

    describe(`${resetPassword.typePrefix} action`, () => {
      test(`should create '${resetPassword.fulfilled.type}' when send reset password request`, async () => {
        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
        } = await dispatch(resetPassword(mocks.resetPassword.requestBody))

        const expectedActions = [
          resetPassword.pending(requestId, mocks.resetPassword.requestBody),
          resetPassword.fulfilled(
            mocks.resetPassword.response,
            requestId,
            mocks.resetPassword.requestBody,
          ),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)

      test(`should create '${resetPassword.rejected.type}' when failed to send password restoration code`, async () => {
        server.use(resetPasswordErrorHandler)

        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
          payload,
        } = await dispatch(resetPassword(mocks.resetPassword.requestBody))

        const expectedActions = [
          resetPassword.pending(requestId, mocks.resetPassword.requestBody),
          resetPassword.rejected(
            null,
            requestId,
            mocks.resetPassword.requestBody,
            payload as IAxiosSerializedError,
          ),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IResetPasswordPageState>(initialState)
    })

    test('should handle fetching status being set to "loading"', () => {
      const state = reducer(initialState, createAction(resetPassword.pending.type))
      expect(state).toEqual<IResetPasswordPageState>({ ...initialState, status: 'loading' })
    })

    test('should handle fetching status and login info being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<TPasswordForgotResponse>(resetPassword.fulfilled.type)(
          mocks.resetPassword.response,
        ),
      )
      expect(state).toEqual<IResetPasswordPageState>({
        status: 'loaded',
        res: mocks.resetPassword.response,
      })
    })

    test('should handle fetching status being set to "error"', () => {
      const state = reducer(initialState, createAction(resetPassword.rejected.type))
      expect(state).toEqual<IResetPasswordPageState>({ ...initialState, status: 'error' })
    })
  })
})
