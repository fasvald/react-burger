import { IBurgerIngredientUnique } from '../../../common/models/data.model'
import { IBurgerConstructorIngredientProps } from '../burger-constructor.model'

export interface IBurgerConstructorIngredientDraggable extends IBurgerConstructorIngredientProps {
  handleRemove: (ingredient: IBurgerIngredientUnique) => void
}
