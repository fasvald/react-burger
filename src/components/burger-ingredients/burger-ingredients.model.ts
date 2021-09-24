import { IBurgerIngredient, TFetchProcess } from '../../common/models/data.model'

export interface IBurgerIngredientsState {
  status: TFetchProcess
  items: IBurgerIngredient[]
}
