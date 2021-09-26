import { IBurgerIngredientUnique } from '../../../common/models/data.model'
import { IBurgerConstructorIngredientProps } from '../burger-constructor.model'

export interface IBurgerConstructorIngredientDraggable extends IBurgerConstructorIngredientProps {
  id: string

  moveCard: (id: string, atIndex: number) => void
  findCard: (id: string) => any
  handleRemove: (ingredient: IBurgerIngredientUnique) => void
}
