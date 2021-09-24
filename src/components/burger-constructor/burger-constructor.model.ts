import { ReactNode } from 'react'

import { IBurgerIngredientUnique } from '../../common/models/data.model'

export interface IBurgerConstructorIngredientProps {
  className: string
  ingredient: IBurgerIngredientUnique
}

export interface IBurgerConstructorState {
  ingredients: IBurgerIngredientUnique[]
}

export interface IBurgerConstructorProviderProps {
  children: ReactNode
}

export interface IGroupedIngredients {
  bun: IBurgerIngredientUnique[]
  toppings: IBurgerIngredientUnique[]
}