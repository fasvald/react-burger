import { TBurgerIngredientType } from '../../common/models/fetch-process.model'

export interface IBurgerIngredient {
  _id: string
  name: string
  type: TBurgerIngredientType
  proteins: number
  fat: number
  carbohydrates: number
  calories: number
  price: number
  image: string
  image_mobile: string
  image_large: string
  __v: number
}

export interface IBurgerIngredientUnique extends IBurgerIngredient {
  nanoid: string
}

export interface IBurgerIngredientFetch {
  data: IBurgerIngredient[]
  success: boolean
}

export type IBurgerIngredientFoodEnergy = Pick<
  IBurgerIngredient,
  'calories' | 'proteins' | 'fat' | 'carbohydrates'
>
