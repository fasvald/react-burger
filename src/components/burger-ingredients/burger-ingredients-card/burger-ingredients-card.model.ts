import { IBurgerIngredient } from '../../../common/models/data.model'

export interface IBurgerIngredientsCardProps {
  className?: string
  onClick: (ingredient: IBurgerIngredient) => void
  ingredient: IBurgerIngredient
}
