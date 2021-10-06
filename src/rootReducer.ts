import authReducer from './common/services/slices/auth/auth.slice'
import burgerConstructorReducer from './components/burger-constructor/burger-constructor.slice'
import burgerIngredientsReducer from './components/burger-ingredients/burger-ingredients.slice'
import ingredientDetailsReducer from './components/ingredient-details/ingredient-details.slice'
import orderDetailsReducer from './components/order-details/order-details.slice'
import forgotPasswordReducer from './pages/forgot-password/forgot-password-page.slice'
import resetPasswordReducer from './pages/reset-password/reset-password-page.slice'

const rootReducer = {
  auth: authReducer,
  burgerConstructor: burgerConstructorReducer,
  burgerIngredients: burgerIngredientsReducer,
  forgotPassword: forgotPasswordReducer,
  ingredientDetails: ingredientDetailsReducer,
  orderDetails: orderDetailsReducer,
  resetPassword: resetPasswordReducer,
}

export default rootReducer
