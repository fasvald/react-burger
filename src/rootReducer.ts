import burgerConstructorReducer from './services/reducers/burger-constructor.reducer'
import burgerIngredientsReducer from './services/reducers/burger-ingredients.reducer'
import ingredientDetailsReducer from './services/reducers/ingredient-details.reducer'
import orderDetailsReducer from './services/reducers/order-details.reducer'

const rootReducer = {
  burgerIngredients: burgerIngredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  ingredientDetails: ingredientDetailsReducer,
  orderDetails: orderDetailsReducer,
}

export default rootReducer
