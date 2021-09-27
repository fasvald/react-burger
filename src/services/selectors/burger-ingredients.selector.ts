import { createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'

import {
  IBurgerIngredient,
  TBurgerIngredientType,
  TFetchProcess,
} from '../../common/models/data.model'
import { RootState } from '../../store'

export const ingredientsSelector = (state: RootState): IBurgerIngredient[] =>
  state.burgerIngredients.items

export const ingredientsFetchStatusSelector = (state: RootState): TFetchProcess =>
  state.burgerIngredients.status

export const selectIngredientsByType = createSelector([ingredientsSelector], (ingredients) =>
  memoize((type: TBurgerIngredientType) =>
    ingredients.filter((ingredient) => ingredient.type === type),
  ),
)
