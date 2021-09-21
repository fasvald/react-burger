/**
 * NOTE: The pattern of working with context is based on articles of Kent C. Dodds.
 *
 * Links for reference:
 * - https://kentcdodds.com/blog/how-to-use-react-context-effectively;
 * - https://kentcdodds.com/blog/how-to-optimize-your-context-value.
 *
 * Bonus: https://hswolff.com/blog/how-to-usecontext-with-usereducer/ - (explanation) how to deal
 * with performance concerns working with useReducer and passing state + dispatch as a value
 * (Spoiler: 2 ways how to deal with).
 *
 * And because both options are the same I am going to use option one => `useMemo`.
 */

import React, { useMemo, useReducer } from 'react'

import BurgerConstructorActionKind from './burger-constructor.constant'
import {
  IBurgerConstructorAction,
  IBurgerConstructorContext,
  IBurgerConstructorProviderProps,
  IBurgerConstructorState,
} from './burger-constructor.model'
import { addIngredient, removeIngredient } from './burger-constructor.utils'

const BurgerConstructorContext = React.createContext<IBurgerConstructorContext | undefined>(
  undefined,
)

function burgerConstructorReducer(
  state: IBurgerConstructorState,
  action: IBurgerConstructorAction,
) {
  switch (action.type) {
    case BurgerConstructorActionKind.Add: {
      return {
        ...state,
        ingredients: addIngredient(state.ingredients, action.item),
      }
    }
    case BurgerConstructorActionKind.Remove: {
      return {
        ...state,
        ingredients: removeIngredient(state.ingredients, action.item),
      }
    }
    case BurgerConstructorActionKind.Clear: {
      return { ...state, ingredients: [] }
    }
    default: {
      // Instead of throwing an error, we can return passing state here
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function BurgerConstructorProvider({ children }: IBurgerConstructorProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(burgerConstructorReducer, { ingredients: [] })

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  )

  return (
    <BurgerConstructorContext.Provider value={value}>{children}</BurgerConstructorContext.Provider>
  )
}

function useBurgerConstructor(): IBurgerConstructorContext {
  const context = React.useContext(BurgerConstructorContext)

  if (context === undefined) {
    throw new Error('"useBurgerConstructor" must be used within a "BurgerConstructorProvider"')
  }

  return context
}

export { BurgerConstructorProvider, useBurgerConstructor }
