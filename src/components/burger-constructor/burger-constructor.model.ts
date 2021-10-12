import {IBurgerIngredientUnique} from "../burger-ingredients/burger-ingredients.model";

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
