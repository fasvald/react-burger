import { createAction } from '@reduxjs/toolkit'
import { AnyAction } from 'redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { TPasswordForgotResponse } from '@common/models/auth.model'
import { IAxiosSerializedError } from '@common/models/errors.model'
import { forgotPasswordErrorHandler } from '@mocks/handlers'
import { mocks } from '@mocks/mocks'
import { server } from '@mocks/server'
import { AppDispatch, RootState } from '@store'

import reducer, {
  forgotPasswordStatusSelector,
  IForgotPasswordPageState,
  sendPasswordRestorationCode,
} from './forgot-password-page.slice'

const initialState: IForgotPasswordPageState = {
  status: 'idle',
  res: null,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Forgot Password Page Slice', () => {
  describe('Selectors', () => {
    test('should select status state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ forgotPasswordPage: state })
      const status = forgotPasswordStatusSelector(store.getState() as RootState)

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

    describe(`${sendPasswordRestorationCode.typePrefix} action`, () => {
      test(`should create '${sendPasswordRestorationCode.fulfilled.type}' when send password restoration code`, async () => {
        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
        } = await dispatch(sendPasswordRestorationCode(mocks.forgotPassword.requestBody))

        const expectedActions = [
          sendPasswordRestorationCode.pending(requestId, mocks.forgotPassword.requestBody),
          sendPasswordRestorationCode.fulfilled(
            mocks.forgotPassword.response,
            requestId,
            mocks.forgotPassword.requestBody,
          ),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)

      test(`should create '${sendPasswordRestorationCode.rejected.type}' when failed to send password restoration code`, async () => {
        server.use(forgotPasswordErrorHandler)

        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
          payload,
        } = await dispatch(sendPasswordRestorationCode(mocks.forgotPassword.requestBody))

        const expectedActions = [
          sendPasswordRestorationCode.pending(requestId, mocks.forgotPassword.requestBody),
          sendPasswordRestorationCode.rejected(
            null,
            requestId,
            mocks.forgotPassword.requestBody,
            payload as IAxiosSerializedError,
          ),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IForgotPasswordPageState>(initialState)
    })

    test('should handle fetching status being set to "loading"', () => {
      const state = reducer(initialState, createAction(sendPasswordRestorationCode.pending.type))
      expect(state).toEqual<IForgotPasswordPageState>({ ...initialState, status: 'loading' })
    })

    test('should handle fetching status and login info being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<TPasswordForgotResponse>(sendPasswordRestorationCode.fulfilled.type)(
          mocks.forgotPassword.response,
        ),
      )
      expect(state).toEqual<IForgotPasswordPageState>({
        status: 'loaded',
        res: mocks.forgotPassword.response,
      })
    })

    test('should handle fetching status being set to "error"', () => {
      const state = reducer(initialState, createAction(sendPasswordRestorationCode.rejected.type))
      expect(state).toEqual<IForgotPasswordPageState>({ ...initialState, status: 'error' })
    })
  })
})
