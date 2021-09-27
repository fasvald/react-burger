import { IBurgerIngredientUnique } from '../../../common/models/data.model'
import { IBurgerConstructorIngredientProps } from '../burger-constructor.model'

export interface IBurgerConstructorIngredientDraggable extends IBurgerConstructorIngredientProps {
  moveIngredient: (id: string, atIndex: number) => void
  findIngredient: (id: string) => { topping: IBurgerIngredientUnique; index: number }
  removeIngredient: (ingredient: IBurgerIngredientUnique) => void
}
