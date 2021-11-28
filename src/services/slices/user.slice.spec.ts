import { PayloadAction } from '@reduxjs/toolkit'
import { Action, AnyAction } from 'redux'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { IAuthUser } from '@common/models/auth.model'
import { IAxiosSerializedError } from '@common/models/errors.model'
import { profileErrorHandler, profilePatchErrorHandler } from '@mocks/handlers'
import { mocks } from '@mocks/mocks'
import { server } from '@mocks/server'
import { AppDispatch, RootState } from '@store'

import reducer, {
  clearUser,
  getUser,
  IUserState,
  saveUser,
  updateUser,
  userSelector,
} from './user.slice'

const initialState: IUserState = {
  user: null,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('User Slice', () => {
  describe('Selectors', () => {
    test('should select user state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ user: { user: state } })
      const user = userSelector(store.getState() as RootState)

      expect(user).toEqual(initialState)
    })
  })

  describe('Actions', () => {
    test(`should create '${saveUser.type}' when save user`, () => {
      const expectedAction: PayloadAction<IAuthUser> = {
        type: saveUser.type,
        payload: mocks.user,
      }

      expect(saveUser(mocks.user)).toEqual(expectedAction)
    })

    test(`should create '${clearUser.type}' when clear user`, () => {
      const expectedAction: Action = {
        type: clearUser.type,
      }

      expect(clearUser()).toEqual(expectedAction)
    })
  })

  describe('Async actions', () => {
    // Enable API mocking before tests
    beforeAll(() => server.listen())

    // Reset any runtime request handlers we may add during the tests
    afterEach(() => server.resetHandlers())

    // Disable API mocking after the tests are done
    afterAll(() => server.close())

    describe(`'${getUser.typePrefix}' action`, () => {
      test(`should create '${getUser.fulfilled.type}' when fetch & receive a user info`, async () => {
        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
        } = await dispatch(getUser())

        const expectedActions = [
          getUser.pending(requestId, undefined),
          getUser.fulfilled(mocks.profile.response, requestId, undefined),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)

      test(`should create '${getUser.rejected.type}' when fetch & failed to receive a user info`, async () => {
        server.use(profileErrorHandler)

        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
          payload,
        } = await dispatch(getUser())

        const expectedActions = [
          getUser.pending(requestId, undefined),
          getUser.rejected(null, requestId, undefined, payload as IAxiosSerializedError),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)
    })

    describe(`'${updateUser.typePrefix}' action`, () => {
      test(`should create '${updateUser.fulfilled.type}' when send & update a user info`, async () => {
        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
        } = await dispatch(updateUser(mocks.user))

        const expectedActions = [
          updateUser.pending(requestId, mocks.user),
          updateUser.fulfilled(mocks.profileUpdate.response, requestId, mocks.user),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)

      test(`should create '${updateUser.rejected.type}' when send & failed to update a user info`, async () => {
        server.use(profilePatchErrorHandler)

        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
          payload,
        } = await dispatch(updateUser(mocks.user))

        const expectedActions = [
          updateUser.pending(requestId, mocks.user),
          updateUser.rejected(null, requestId, mocks.user, payload as IAxiosSerializedError),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)
    })
  })

  describe('Reducer', () => {
    const updatedState = {
      user: mocks.user,
    }

    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IUserState>(initialState)
    })

    test('should handle a user being added to state', () => {
      expect(reducer(initialState, saveUser(mocks.user))).toEqual<IUserState>(updatedState)
    })

    test('should handle a user being removed from state', () => {
      expect(reducer(updatedState, clearUser())).toEqual<IUserState>(initialState)
    })
  })
})
