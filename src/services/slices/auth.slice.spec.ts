import { PayloadAction } from '@reduxjs/toolkit'
import { Action, AnyAction } from 'redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { IAuthUser } from '@common/models/auth.model'
import { IAxiosSerializedError } from '@common/models/errors.model'
import { signInErrorHandler, signOutErrorHandler, signUpErrorHandler } from '@mocks/handlers'
import { mocks } from '@mocks/mocks.constant'
import { server } from '@mocks/server'
import { AppDispatch, RootState } from '@store'

import reducer, {
  saveAuthorizedUser,
  clearAuthorizedUser,
  IAuthState,
  authSelector,
  signIn,
  signUp,
  signOut,
} from './auth.slice'

const initialState: IAuthState = {
  isLoggedIn: false,
  user: null,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Auth Slice', () => {
  describe('Selectors', () => {
    test('should select auth state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ auth: state })
      const auth = authSelector(store.getState() as RootState)

      expect(auth).toEqual(initialState)
    })
  })

  describe('Actions', () => {
    test(`should create '${saveAuthorizedUser.type}' when receive & save user`, () => {
      const expectedAction: PayloadAction<IAuthUser> = {
        type: saveAuthorizedUser.type,
        payload: mocks.user,
      }

      expect(saveAuthorizedUser(mocks.user)).toEqual(expectedAction)
    })

    test(`should create '${clearAuthorizedUser.type}' when remove user`, () => {
      const expectedAction: Action = {
        type: clearAuthorizedUser.type,
      }

      expect(clearAuthorizedUser()).toEqual(expectedAction)
    })
  })

  describe('Async actions', () => {
    // Enable API mocking before tests
    beforeAll(() => server.listen())

    // Reset any runtime request handlers we may add during the tests
    afterEach(() => server.resetHandlers())

    // Disable API mocking after the tests are done
    afterAll(() => server.close())

    test(`should create '${signIn.fulfilled.type}' when fetch & receive a user after sign in request`, async () => {
      const store = mockStore({})
      const { dispatch }: { dispatch: AppDispatch } = store

      // NOTE: Reason to do it like this => https://github.com/reduxjs/redux-toolkit/issues/494
      const {
        meta: { requestId },
      } = await dispatch(signIn(mocks.signIn.requestBody))

      const expectedActions = [
        signIn.pending(requestId, mocks.signIn.requestBody),
        signIn.fulfilled(mocks.signIn.response, requestId, mocks.signIn.requestBody),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    }, 30000)

    test(`should create '${signIn.rejected.type}' when fetch & failed to receive a user after sign in request`, async () => {
      server.use(signInErrorHandler)

      const store = mockStore({})
      const { dispatch }: { dispatch: AppDispatch } = store

      const {
        meta: { requestId },
        payload,
      } = await dispatch(signIn(mocks.signIn.requestBody))

      const expectedActions = [
        signIn.pending(requestId, mocks.signIn.requestBody),
        signIn.rejected(
          null,
          requestId,
          mocks.signIn.requestBody,
          payload as IAxiosSerializedError,
        ),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    }, 30000)

    test(`should create '${signUp.fulfilled.type}' when fetch & create a user after sign up request`, async () => {
      const store = mockStore({})
      const { dispatch }: { dispatch: AppDispatch } = store

      const {
        meta: { requestId },
      } = await dispatch(signUp(mocks.signUp.requestBody))

      const expectedActions = [
        signUp.pending(requestId, mocks.signUp.requestBody),
        signUp.fulfilled(mocks.signUp.response, requestId, mocks.signUp.requestBody),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    test(`should create '${signUp.rejected.type}' when fetch & failed to create a user after sign up request`, async () => {
      server.use(signUpErrorHandler)

      const store = mockStore({})
      const { dispatch }: { dispatch: AppDispatch } = store

      const {
        meta: { requestId },
        payload,
      } = await dispatch(signUp(mocks.signUp.requestBody))

      const expectedActions = [
        signUp.pending(requestId, mocks.signUp.requestBody),
        signUp.rejected(
          null,
          requestId,
          mocks.signUp.requestBody,
          payload as IAxiosSerializedError,
        ),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    })

    test(`should create '${signOut.fulfilled}' when fetch & receive a message after sign out request`, async () => {
      const store = mockStore({})
      const { dispatch }: { dispatch: AppDispatch } = store

      const {
        meta: { requestId },
      } = await dispatch(signOut())

      const expectedActions = [
        signOut.pending(requestId),
        signOut.fulfilled(mocks.signOut.response, requestId),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    }, 30000)

    test(`should create '${signOut.rejected}' when fetch & failed to receive a message after sign out request`, async () => {
      server.use(signOutErrorHandler)

      const store = mockStore({})
      const { dispatch }: { dispatch: AppDispatch } = store

      const {
        meta: { requestId },
        payload,
      } = await dispatch(signOut())

      const expectedActions = [
        signOut.pending(requestId),
        signOut.rejected(null, requestId, undefined, payload as IAxiosSerializedError),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    }, 30000)
  })

  describe('Reducer', () => {
    const updatedState = {
      isLoggedIn: true,
      user: mocks.user,
    }

    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IAuthState>(initialState)
    })

    test('should handle an authorized user being added to state', () => {
      expect(reducer(initialState, saveAuthorizedUser(mocks.user))).toEqual<IAuthState>(
        updatedState,
      )
    })

    test('should handle an authorized user being removed from state', () => {
      expect(reducer(updatedState, clearAuthorizedUser())).toEqual<IAuthState>(initialState)
    })
  })
})
