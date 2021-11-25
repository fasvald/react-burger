import { AnyAction } from 'redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { signInErrorHandler } from '@mocks/handlers'
import { mocks } from '@mocks/mocks.constant'
import { server } from '@mocks/server'
import { AppDispatch, RootState } from '@store'

import reducer, {
  saveAuthorizedUser,
  clearAuthorizedUser,
  IAuthState,
  authSelector,
  signIn,
} from './auth.slice'

const initialState: IAuthState = {
  isLoggedIn: false,
  user: null,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

const { signIn: signInMocks, user: userMock } = mocks

describe('Auth Slice', () => {
  describe('Auth selectors', () => {
    test('should select auth state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ auth: state })
      const auth = authSelector(store.getState() as RootState)

      expect(auth).toEqual(initialState)
    })
  })

  describe('Auth reducer', () => {
    const updatedState = {
      isLoggedIn: true,
      user: userMock,
    }

    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IAuthState>(initialState)
    })

    test('should handle an authorized user being added to an initialized store', () => {
      expect(reducer(initialState, saveAuthorizedUser(userMock))).toEqual<IAuthState>(updatedState)
    })

    test('should handle an authorized user being removed from a store', () => {
      expect(reducer(updatedState, clearAuthorizedUser())).toEqual<IAuthState>(initialState)
    })
  })

  describe('Auth async thunks', () => {
    // Enable API mocking before tests
    beforeAll(() => server.listen())

    // Reset any runtime request handlers we may add during the tests
    afterEach(() => server.resetHandlers())

    // Disable API mocking after the tests are done
    afterAll(() => server.close())

    test('should fetch & receive a user after sign in request', async () => {
      // Here we just checking if the right actions will be created
      const store = mockStore({})
      const { dispatch }: { dispatch: AppDispatch } = store

      // NOTE: Reason to do it like this => https://github.com/reduxjs/redux-toolkit/issues/494
      const {
        meta: { requestId },
      } = await dispatch(signIn(signInMocks.requestBody))

      const expectedActions = [
        signIn.pending(requestId, signInMocks.requestBody),
        signIn.fulfilled(signInMocks.response, requestId, signInMocks.requestBody),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    }, 30000)

    test('should fetch & failed to receive a user after sign in request', async () => {
      server.use(signInErrorHandler)

      const store = mockStore({})
      const { dispatch }: { dispatch: AppDispatch } = store

      const {
        meta: { requestId },
        payload,
      } = await dispatch(signIn(signInMocks.requestBody))

      const expectedActions = [
        signIn.pending(requestId, signInMocks.requestBody),
        signIn.rejected(null, requestId, signInMocks.requestBody, payload as any),
      ]

      expect(store.getActions()).toEqual(expectedActions)
    }, 30000)
  })
})
