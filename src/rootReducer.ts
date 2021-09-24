import { burgerConstructorReducer } from './components/burger-constructor/burger-constructor.slice'
import { burgerIngredientsReducer } from './components/burger-ingredients/burger-ingredients.slice'
import { ingredientDetailsReducer } from './components/ingredient-details/ingredient-details.slice'

const rootReducer = {
  burgerIngredients: burgerIngredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  ingredientDetails: ingredientDetailsReducer,
}

export default rootReducer
