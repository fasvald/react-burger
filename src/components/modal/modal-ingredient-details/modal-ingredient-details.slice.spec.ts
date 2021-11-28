import { AnyAction, createAction } from '@reduxjs/toolkit'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { ingredientsData } from '@common/constants/ingredients-mock.constant'
import { IBurgerIngredient } from '@components/burger-ingredients/burger-ingredients.model'
import burgerIngredientsReducer from '@components/burger-ingredients/burger-ingredients.slice'
import { RootState } from '@store'

import reducer, {
  chosenIngredientDetailsSelector,
  IIngredientDetailsState,
  removeIngredientDetails,
  saveIngredientDetails,
  selectChosenIngredient,
} from './modal-ingredient-details.slice'

const initialState: IIngredientDetailsState = {
  ingredient: null,
}

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

describe('Modal Ingredient Details Slice', () => {
  describe('Selectors', () => {
    test('should select chosen ingredient details in state from store correctly', () => {
      const state = reducer(initialState, {} as AnyAction)
      const store = mockStore({ ingredientDetails: state })
      const ingredient = chosenIngredientDetailsSelector(store.getState() as RootState)

      expect(ingredient).toEqual(initialState.ingredient)
    })

    test('should select chosen ingredient when modal in state from store correctly', () => {
      const ingredientsState = burgerIngredientsReducer(
        { status: 'loaded', items: ingredientsData },
        {} as AnyAction,
      )
      const ingredientDetailsState = reducer({ ingredient: ingredientsData[0] }, {} as AnyAction)

      const store = mockStore({
        burgerIngredients: ingredientsState,
        ingredientDetails: ingredientDetailsState,
      })

      expect(selectChosenIngredient(store.getState() as RootState)()).toEqual(ingredientsData[0])
    })

    test('should select chosen ingredient when modal as full page in state from store correctly', () => {
      const ingredientsState = burgerIngredientsReducer(
        { status: 'loaded', items: ingredientsData },
        {} as AnyAction,
      )
      const ingredientDetailsState = reducer(initialState, {} as AnyAction)

      const store = mockStore({
        burgerIngredients: ingredientsState,
        ingredientDetails: ingredientDetailsState,
      })

      expect(selectChosenIngredient(store.getState() as RootState)(ingredientsData[0]._id)).toEqual(
        ingredientsData[0],
      )
    })
  })

  describe('Actions', () => {
    test(`should create "${saveIngredientDetails.type}" when save ingredient details`, () => {
      expect(saveIngredientDetails(ingredientsData[0])).toEqual(
        createAction<IBurgerIngredient>(saveIngredientDetails.type)(ingredientsData[0]),
      )
    })

    test(`should create "${removeIngredientDetails.type}" when remove ingredient details`, () => {
      expect(removeIngredientDetails()).toEqual(createAction(removeIngredientDetails.type)())
    })
  })

  describe('Reducer', () => {
    test('should return the initial state', () => {
      expect(reducer(undefined, {} as AnyAction)).toEqual<IIngredientDetailsState>(initialState)
    })

    test('should handle an ingredient details being updated in state', () => {
      expect(
        reducer(initialState, saveIngredientDetails(ingredientsData[0])),
      ).toEqual<IIngredientDetailsState>({
        ingredient: ingredientsData[0],
      })
    })

    test('should handle an ingredient details being removed from state', () => {
      expect(
        reducer({ ingredient: ingredientsData[0] }, removeIngredientDetails()),
      ).toEqual<IIngredientDetailsState>({
        ingredient: null,
      })
    })
  })
})
