import burgerConstructorReducer from '@components/burger-constructor/burger-constructor.slice'
import burgerIngredientsReducer from '@components/burger-ingredients/burger-ingredients.slice'
import modalIngredientDetailsReducer from '@components/modal/modal-ingredient-details/modal-ingredient-details.slice'
import modalOrderCreationDetailsSlice from '@components/modal/modal-order-creation-details/modal-order-creation-details.slice'
import modalOrderDetailsReducer from '@components/modal/modal-order-details/modal-order-details.slice'
import feedPageReducer from '@pages/feed/feed-page.slice'
import forgotPasswordPageReducer from '@pages/forgot-password/forgot-password-page.slice'
import loginPageReducer from '@pages/login/login-page.slice'
import profilePageReducer from '@pages/profile/profile-page.slice'
import userDetailsPageReducer from '@pages/profile/user-details/user-details-page.slice'
import registerPageReducer from '@pages/register/register-page.slice'
import resetPasswordPageReducer from '@pages/reset-password/reset-password-page.slice'
import authReducer from '@services/slices/auth.slice'
import userReducer from '@services/slices/user.slice'
import wsReducer from '@services/slices/web-sockets.slice'

const rootReducer = {
  // Global reducers (auth, etc.)
  auth: authReducer,
  user: userReducer,
  ws: wsReducer,
  // Page related reducers
  loginPage: loginPageReducer,
  registerPage: registerPageReducer,
  forgotPasswordPage: forgotPasswordPageReducer,
  resetPasswordPage: resetPasswordPageReducer,
  profilePage: profilePageReducer,
  userDetailsPage: userDetailsPageReducer,
  feedPage: feedPageReducer,
  // Components related reducers
  burgerIngredients: burgerIngredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  // Modals related reducers
  ingredientDetails: modalIngredientDetailsReducer,
  orderCreationDetails: modalOrderCreationDetailsSlice,
  orderDetails: modalOrderDetailsReducer,
}

export default rootReducer
