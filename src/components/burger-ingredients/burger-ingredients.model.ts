import { PayloadAction } from '@reduxjs/toolkit'

import { IBurgerIngredient, TFetchProcess } from '../../common/models/data.model'

export interface IBurgerIngredientsProps {
  ingredients: IBurgerIngredient[]
}

export interface IBurgerIngredientsState {
  status: TFetchProcess
  items: IBurgerIngredient[]
}
