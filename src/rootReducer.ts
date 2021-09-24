import { burgerConstructorReducer } from './components/burger-constructor/burger-constructor.slice'
import { burgerIngredientsReducer } from './components/burger-ingredients/burger-ingredients.slice'
import { ingredientDetailsReducer } from './components/ingredient-details/ingredient-details.slice'
import { orderDetailsReducer } from './components/order-details/order-details.slice'

const rootReducer = {
  burgerIngredients: burgerIngredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  ingredientDetails: ingredientDetailsReducer,
  orderDetails: orderDetailsReducer,
}

export default rootReducer
