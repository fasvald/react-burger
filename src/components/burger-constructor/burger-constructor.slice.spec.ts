import { AnyAction, createAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  ingredientsBunsData,
  ingredientsToppingsData,
} from '@common/constants/ingredients-mock.constant'
import { IBurgerIngredientUnique } from '@components/burger-ingredients/burger-ingredients.model'
import { RootState } from '@store'

import { IBurgerConstructorIngredientState } from './burger-constructor.model'
import reducer, {
  addBun,
  addTopping,
  bunsSelector,
  burgerConstructorSelector,
  clearIngredients,
  removeTopping,
  selectIngredientIterationByID,
  selectIngredientsID,
  selectIngredientsTotalPrice,
  swapTopping,
  toppingsSelector,
} from './burger-constructor.slice'
import calculateTotalPrice from './burger-constructor.utils'

const initialState: IBurgerConstructorIngredientState = {
  buns: [],
  toppings: [],
}

const updatedState: IBurgerConstructorIngredientState = {
  buns: ingredientsBunsData,
  toppings: ingredientsToppingsData,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Burger Constructor Slice', () => {
  describe('Selectors', () => {
    test('should select full state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ burgerConstructor: state })
      const fullState = burgerConstructorSelector(store.getState() as RootState)

      expect(fullState).toEqual(initialState)
    })

    test('should select buns in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ burgerConstructor: state })
      const buns = bunsSelector(store.getState() as RootState)

      expect(buns).toEqual(initialState.buns)
    })

    test('should select toppings in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ burgerConstructor: state })
      const toppings = toppingsSelector(store.getState() as RootState)

      expect(toppings).toEqual(initialState.toppings)
    })

    test('should select ingredients total price in state from store correctly', () => {
      const state = reducer(updatedState, {} as AnyAction)
      const store = mockStore({ burgerConstructor: state })

      expect(selectIngredientsTotalPrice(store.getState() as RootState)()).toEqual(
        calculateTotalPrice([...updatedState.buns, ...updatedState.toppings]),
      )
    })

    test('should select ingredients ids in state from store correctly', () => {
      const state = reducer(updatedState, {} as AnyAction)
      const store = mockStore({ burgerConstructor: state })

      const ingredientsIDs = [...updatedState.buns, ...updatedState.toppings].map(
        (item) => item._id,
      )

      expect(selectIngredientsID(store.getState() as RootState)()).toEqual(ingredientsIDs)
    })

    test('should should select ingredient id iteration count in state from store correctly', () => {
      const newState: IBurgerConstructorIngredientState = {
        ...updatedState,
        toppings: [updatedState.toppings[0], updatedState.toppings[0], updatedState.toppings[0]],
      }

      const state = reducer(newState, {} as AnyAction)
      const store = mockStore({ burgerConstructor: state })

      expect(
        selectIngredientIterationByID(store.getState() as RootState)(updatedState.toppings[0]._id),
      ).toEqual(newState.toppings.length)
    })
  })

  describe('Actions', () => {
    test(`should create "${addBun.type}" when bun has been added`, () => {
      const expectedAction = createAction<IBurgerIngredientUnique>(addBun.type)
      // NOTE: I am using "prepare" option for action creators so I couldn't find any info how to proper test it
      const actionResult = addBun(updatedState.buns[0])

      expect(actionResult).toEqual(
        expectedAction({ ...updatedState.buns[0], nanoid: actionResult.payload.nanoid }),
      )
    })

    test(`should create "${addTopping.type}" when topping has been added`, () => {
      const expectedAction = createAction<IBurgerIngredientUnique>(addTopping.type)
      // NOTE: I am using "prepare" option for action creators so I couldn't find any info how to proper test it
      const actionResult = addTopping(updatedState.toppings[0])

      expect(actionResult).toEqual(
        expectedAction({ ...updatedState.toppings[0], nanoid: actionResult.payload.nanoid }),
      )
    })

    test(`should create "${removeTopping.type}" when remove topping`, () => {
      const expectedAction = createAction<IBurgerIngredientUnique>(removeTopping.type)

      expect(removeTopping(updatedState.toppings[0])).toEqual(
        expectedAction({ ...updatedState.toppings[0] }),
      )
    })

    test(`should create "${swapTopping.type}" when remove topping`, () => {
      const expectedAction = createAction<{ toIndex: number; fromIndex: number }>(swapTopping.type)

      expect(swapTopping({ toIndex: 0, fromIndex: 1 })).toEqual(
        expectedAction({ toIndex: 0, fromIndex: 1 }),
      )
    })

    test(`should create "${clearIngredients.type}" when clear toppings`, () => {
      const expectedAction = createAction(clearIngredients.type)

      expect(clearIngredients()).toEqual(expectedAction())
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IBurgerConstructorIngredientState>(
        initialState,
      )
    })

    test('should handle bun being added to state', () => {
      // Same goes here for "prepare" property
      const state = reducer(initialState, addBun(updatedState.buns[0]))

      const bun: IBurgerIngredientUnique = {
        ...updatedState.buns[0],
        nanoid: state.buns[0].nanoid,
      }

      expect(state).toEqual<IBurgerConstructorIngredientState>({
        ...initialState,
        buns: [bun],
      })
    })

    test('should handle topping being added to state', () => {
      // Same goes here for "prepare" property
      const state = reducer(initialState, addTopping(updatedState.toppings[0]))

      const topping: IBurgerIngredientUnique = {
        ...updatedState.toppings[0],
        nanoid: state.toppings[0].nanoid,
      }

      expect(state).toEqual<IBurgerConstructorIngredientState>({
        ...initialState,
        toppings: [topping],
      })
    })

    test('should handle topping being remove', () => {
      const state: IBurgerConstructorIngredientState = {
        ...updatedState,
        toppings: updatedState.toppings.slice(),
      }

      const toppings = state.toppings.slice()
      const toppingIndex = toppings.findIndex((topping) => topping.nanoid === toppings[0].nanoid)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedToppings = toppings.splice(toppingIndex, 1)

      expect(
        reducer(state, removeTopping(state.toppings[0])),
      ).toEqual<IBurgerConstructorIngredientState>({
        ...updatedState,
        toppings,
      })
    })

    test('should handle toppings being swapped', () => {
      const state: IBurgerConstructorIngredientState = {
        ...updatedState,
        toppings: updatedState.toppings.slice(),
      }

      const payload: { toIndex: number; fromIndex: number } = { fromIndex: 0, toIndex: 1 }

      const toppings = state.toppings.slice()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedToppings = toppings.splice(
        payload.toIndex,
        0,
        toppings.splice(payload.fromIndex, 1)[0],
      )

      expect(reducer(state, swapTopping(payload))).toEqual<IBurgerConstructorIngredientState>({
        ...updatedState,
        toppings,
      })
    })

    test('should handle clear ingredients from state', () => {
      expect(reducer(updatedState, clearIngredients())).toEqual<IBurgerConstructorIngredientState>(
        initialState,
      )
    })
  })
})
