import burgerConstructorReducer from './components/burger-constructor/burger-constructor.slice'
import burgerIngredientsReducer from './components/burger-ingredients/burger-ingredients.slice'
import ingredientDetailsReducer from './components/ingredient-details/ingredient-details.slice'
import orderDetailsReducer from './components/order-details/order-details.slice'
import forgotPasswordPageReducer from './pages/forgot-password/forgot-password-page.slice'
import signInReducer from './pages/login/login-page.slice'
import personalInfoReducer from './pages/profile/personal-info/personal-info-page.slice'
import signUpReducer from './pages/register/register-page.slice'
import resetPasswordReducer from './pages/reset-password/reset-password-page.slice'
import authReducer from './services/slices/auth.slice'
import profileReducer from './services/slices/profile.slice'

const rootReducer = {
  auth: authReducer,
  profile: profileReducer,
  signIn: signInReducer,
  signUp: signUpReducer,
  forgotPassword: forgotPasswordPageReducer,
  resetPassword: resetPasswordReducer,
  personalInfo: personalInfoReducer,
  burgerConstructor: burgerConstructorReducer,
  burgerIngredients: burgerIngredientsReducer,
  ingredientDetails: ingredientDetailsReducer,
  orderDetails: orderDetailsReducer,
}

export default rootReducer
