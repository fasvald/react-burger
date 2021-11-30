import { AnyAction, createAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { ingredientsData } from '@common/constants/ingredients-mock.constant'
import { IAxiosSerializedError } from '@common/models/errors.model'
import { ingredientsErrorHandler } from '@mocks/handlers'
import { server } from '@mocks/server'
import { AppDispatch, RootState } from '@store'

import { IBurgerIngredient } from './burger-ingredients.model'
import reducer, {
  getIngredients,
  IBurgerIngredientsState,
  ingredientsFetchStatusSelector,
  ingredientsSelector,
  selectIngredientByID,
  selectIngredientsByIDs,
  selectIngredientsByType,
} from './burger-ingredients.slice'

const initialState: IBurgerIngredientsState = {
  status: 'idle',
  items: [],
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Burger Ingredients Slice', () => {
  describe('Selectors', () => {
    test('should select ingredients from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ burgerIngredients: state })
      const ingredients = ingredientsSelector(store.getState() as RootState)

      expect(ingredients).toEqual(initialState.items)
    })

    test('should select fetch ingredients status from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ burgerIngredients: state })
      const status = ingredientsFetchStatusSelector(store.getState() as RootState)

      expect(status).toEqual(initialState.status)
    })

    test('should select ingredients by type "bun" in state from store correctly', () => {
      const state = reducer({ status: 'loaded', items: ingredientsData }, {} as AnyAction)
      const store = mockStore({ burgerIngredients: state })

      expect(selectIngredientsByType(store.getState() as RootState)('bun')).toEqual(
        ingredientsData.filter((ingredient) => ingredient.type === 'bun'),
      )
    })

    test('should select ingredients by type "main" in state from store correctly', () => {
      const state = reducer({ status: 'loaded', items: ingredientsData }, {} as AnyAction)
      const store = mockStore({ burgerIngredients: state })

      expect(selectIngredientsByType(store.getState() as RootState)('main')).toEqual(
        ingredientsData.filter((ingredient) => ingredient.type === 'main'),
      )
    })

    test('should select ingredients by type "sauce" in state from store correctly', () => {
      const state = reducer({ status: 'loaded', items: ingredientsData }, {} as AnyAction)
      const store = mockStore({ burgerIngredients: state })

      expect(selectIngredientsByType(store.getState() as RootState)('sauce')).toEqual(
        ingredientsData.filter((ingredient) => ingredient.type === 'sauce'),
      )
    })

    test('should select ingredients by id in state from store correctly', () => {
      const state = reducer({ status: 'loaded', items: ingredientsData }, {} as AnyAction)
      const store = mockStore({ burgerIngredients: state })

      expect(selectIngredientByID(store.getState() as RootState)(ingredientsData[0]._id)).toEqual(
        ingredientsData.find((ingredient) => ingredient._id === ingredientsData[0]._id),
      )
    })

    test('should select ingredients by ids in state from store correctly', () => {
      const state = reducer({ status: 'loaded', items: ingredientsData }, {} as AnyAction)
      const store = mockStore({ burgerIngredients: state })

      const ids: string[] = [ingredientsData[0]._id, ingredientsData[1]._id, ingredientsData[2]._id]

      expect(selectIngredientsByIDs(store.getState() as RootState)(ids)).toEqual(
        ids.reduce((acc: IBurgerIngredient[], curr: string) => {
          const ingredient = ingredientsData.find((item) => item._id === curr)

          if (ingredient) {
            acc.push(ingredient)
          }

          return acc
        }, []),
      )
    })
  })

  describe('Async Actions', () => {
    // Enable API mocking before tests
    beforeAll(() => server.listen())

    // Reset any runtime request handlers we may add during the tests
    afterEach(() => server.resetHandlers())

    // Disable API mocking after the tests are done
    afterAll(() => server.close())

    describe(`'${getIngredients.typePrefix}' action`, () => {
      test(`should create '${getIngredients.fulfilled.type}' when fetch & receive ingredients`, async () => {
        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
        } = await dispatch(getIngredients())

        const expectedActions = [
          getIngredients.pending(requestId, undefined),
          getIngredients.fulfilled(ingredientsData, requestId, undefined),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)

      test(`should create '${getIngredients.rejected.type}' when fetch & failed to receive ingredients`, async () => {
        server.use(ingredientsErrorHandler)

        const store = mockStore({})
        const { dispatch }: { dispatch: AppDispatch } = store

        const {
          meta: { requestId },
          payload,
        } = await dispatch(getIngredients())

        const expectedActions = [
          getIngredients.pending(requestId, undefined),
          getIngredients.rejected(null, requestId, undefined, payload as IAxiosSerializedError),
        ]

        expect(store.getActions()).toEqual(expectedActions)
      }, 30000)
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IBurgerIngredientsState>(initialState)
    })

    test('should handle fetching status being set to "loading"', () => {
      const state = reducer(initialState, createAction(getIngredients.pending.type))
      expect(state).toEqual<IBurgerIngredientsState>({ ...initialState, status: 'loading' })
    })

    test('should handle fetching status and login info being updated in state', () => {
      const state = reducer(
        initialState,
        createAction<IBurgerIngredient[]>(getIngredients.fulfilled.type)(ingredientsData),
      )
      expect(state).toEqual<IBurgerIngredientsState>({
        status: 'loaded',
        items: ingredientsData,
      })
    })

    test('should handle fetching status being set to "error"', () => {
      const state = reducer(initialState, createAction(getIngredients.rejected.type))
      expect(state).toEqual<IBurgerIngredientsState>({ ...initialState, status: 'error' })
    })
  })
})
