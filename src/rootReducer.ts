import burgerConstructorReducer from './components/burger-constructor/burger-constructor.slice'
import burgerIngredientsReducer from './components/burger-ingredients/burger-ingredients.slice'
import ingredientDetailsReducer from './components/ingredient-details/ingredient-details.slice'
import orderDetailsReducer from './components/order-details/order-details.slice'
import forgotPasswordPageReducer from './pages/forgot-password/forgot-password-page.slice'
import loginPageReducer from './pages/login/login-page.slice'
import profilePageReducer from './pages/profile/profile-page.slice'
import userDetailsPageReducer from './pages/profile/user-details/user-details-page.slice'
import registerPageReducer from './pages/register/register-page.slice'
import resetPasswordPageReducer from './pages/reset-password/reset-password-page.slice'
import authReducer from './services/slices/auth.slice'
import userReducer from './services/slices/user.slice'

const rootReducer = {
  // Global reducers (auth, etc.)
  auth: authReducer,
  user: userReducer,
  // Page related reducers
  loginPage: loginPageReducer,
  registerPage: registerPageReducer,
  forgotPasswordPage: forgotPasswordPageReducer,
  resetPasswordPage: resetPasswordPageReducer,
  profilePage: profilePageReducer,
  userDetailsPage: userDetailsPageReducer,
  // Components related reducers
  burgerIngredients: burgerIngredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  ingredientDetails: ingredientDetailsReducer,
  orderDetails: orderDetailsReducer,
}

export default rootReducer
