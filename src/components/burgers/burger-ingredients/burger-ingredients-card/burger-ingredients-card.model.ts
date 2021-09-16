import { IBurgerIngredient } from '../../../../common/models/data.model'

export interface IBurgerIngredientsCardProps {
  className?: string
  onClick: () => void
  ingredient: IBurgerIngredient
}
