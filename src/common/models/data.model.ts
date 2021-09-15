export type TFetchProcess = 'idle' | 'loading' | 'loaded' | 'error'

export type TBurgerIngredientType = 'bun' | 'sauce' | 'main'

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

export interface IBurgerIngredientFetch {
  data: IBurgerIngredient[]
  success: boolean
}

export type IBurgerIngredientFoodEnergy = Pick<
  IBurgerIngredient,
  'calories' | 'proteins' | 'fat' | 'carbohydrates'
>
