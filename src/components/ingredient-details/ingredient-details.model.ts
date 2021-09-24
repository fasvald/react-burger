import { IBurgerIngredient } from '../../common/models/data.model'

export interface IIngredientDetailsProps {
  ingredient: IBurgerIngredient
}

export interface IIngredientDetailsState {
  ingredient: IBurgerIngredient | null
}
