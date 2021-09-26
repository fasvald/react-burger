import { IBurgerIngredient } from '../../../common/models/data.model'

export interface IBurgerIngredientsCardProps {
  className?: string
  ingredient: IBurgerIngredient
  onClick: (ingredient: IBurgerIngredient) => void
}
