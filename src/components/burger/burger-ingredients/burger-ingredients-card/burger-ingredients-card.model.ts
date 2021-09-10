export type TBurgerIngredientsTypes = 'bum' | 'sauce' | 'main'

export interface IBurgerIngredientsResItem {
  '_id': string
  name: string
  type: TBurgerIngredientsTypes
  proteins: number
  fat: number
  carbohydrates: number
  calories: number
  price: number
  image: string
  image_mobile: string
  image_large: string
  '__v': number
}

export interface IBurgerIngredientsCardProps {
  ingredientInfo: IBurgerIngredientsResItem
}
