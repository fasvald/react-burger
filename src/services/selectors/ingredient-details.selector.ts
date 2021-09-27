import { IBurgerIngredient } from '../../common/models/data.model'
import { RootState } from '../../store'

const ingredientDetailsSelector = (state: RootState): IBurgerIngredient | null =>
  state.ingredientDetails.ingredient

export default ingredientDetailsSelector
