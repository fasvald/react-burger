import { IBurgerIngredient } from '../../../common/models/data.model'

export interface IBurgerConstructorProps {
  ingredients: IBurgerIngredient[]
}

export interface IBurgerConstructorIngredientProps {
  className: string
  ingredient: IBurgerIngredient
}
