import { ReactNode } from 'react'

import { IBurgerIngredientUnique } from '../../../common/models/data.model'

export enum BurgerConstructorActionKind {
  Add = 'ADD',
  Remove = 'REMOVE',
  Clear = 'CLEAR',
}

// export interface IBurgerConstructorProps {}

export interface IBurgerConstructorIngredientProps {
  className: string
  ingredient: IBurgerIngredientUnique
}

export interface IBurgerConstructorAction {
  type: BurgerConstructorActionKind
  item: IBurgerIngredientUnique
}

export interface IBurgerConstructorState {
  ingredients: IBurgerIngredientUnique[]
}

export type TBurgerConstructorDispatch = (action: IBurgerConstructorAction) => void

export interface IBurgerConstructorProviderProps {
  children: ReactNode
}

export interface IBurgerConstructorContext {
  state: IBurgerConstructorState
  dispatch: TBurgerConstructorDispatch
}

export interface IGroupedIngredients {
  bun: IBurgerIngredientUnique[]
  toppings: IBurgerIngredientUnique[]
}
