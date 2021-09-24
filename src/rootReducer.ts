import { burgerIngredientsReducer } from './components/burger-ingredients/burger-ingredients.slice'
import { ingredientDetailsReducer } from './components/ingredient-details/ingredient-details.slice'

const rootReducer = {
  burgerIngredients: burgerIngredientsReducer,
  ingredientDetails: ingredientDetailsReducer,
}

export default rootReducer
