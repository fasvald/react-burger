import { IBurgerIngredientUnique } from '../../common/models/data.model'

export interface IBurgerConstructorIngredientProps {
  className: string
  ingredient: IBurgerIngredientUnique
}

export interface IBurgerConstructorState {
  ingredients: IBurgerIngredientUnique[]
}

export interface IGroupedIngredients {
  bun: IBurgerIngredientUnique[]
  toppings: IBurgerIngredientUnique[]
}

export interface IBurgerConstructorIngredientState {
  buns: IBurgerIngredientUnique[]
  toppings: IBurgerIngredientUnique[]
}
