export const BASE_WS_URL = 'wss://norma.nomoreparties.space'

export const BASE_URL = 'https://norma.nomoreparties.space/api'

export const API_ENDPOINTS = {
  ingredients: `/ingredients`,
  orders: `/orders`,
  passwordForgot: `/password-reset`,
  passwordReset: `/password-reset/reset`,
  signIn: `/auth/login`,
  signUp: `/auth/register`,
  singOut: `/auth/logout`,
  profile: `/auth/user`,
  token: `/auth/token`,
  ordersAll: '/orders/all',
}

export const WS_ENDPOINTS = {
  orders: `${BASE_WS_URL}/orders`,
  ordersAll: `${BASE_WS_URL}/orders/all`,
}
