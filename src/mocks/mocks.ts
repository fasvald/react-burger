/* eslint-disable import/prefer-default-export */

import { nanoid } from 'nanoid'

import { ingredientsData } from '@common/constants/ingredients-mock.constant'
import {
  IPasswordForgotRequestBody,
  IPasswordResetRequestBody,
  IProfileResponse,
  ISignInRequestBody,
  ISignOutResponse,
  ISignUpRequestBody,
  TPasswordForgotResponse,
  TSignInResponse,
} from '@common/models/auth.model'
import {
  IOrderByIDResponse,
  IOrderByNumberBody,
  IOrdersResponse,
} from '@common/models/orders.model'
import {
  IOrderDetailsBody,
  IOrderDetailsResponse,
} from '@components/modal/modal-order-creation-details/modal-order-creation-details.model'
import { IAuthState } from '@services/slices/auth.slice'

export const userMock: IAuthState['user'] = {
  name: 'Hanz',
  email: 'mock@mock.com',
}

export const signInRequestBodyMock: ISignInRequestBody = {
  email: 'mock@mock.com',
  password: 'mockPassword',
}

export const authDefaultResponseMock: TSignInResponse = {
  success: true,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: userMock,
}

export const signUpRequestBodyMock: ISignUpRequestBody = {
  email: userMock.email,
  name: userMock.name,
  password: 'mockPassword',
}

export const signOutResponseMock: ISignOutResponse = {
  success: true,
  message: 'Sign Out',
}

export const orderResponseMock: IOrdersResponse = {
  success: true,
  total: 2,
  totalToday: 2,
  orders: [
    {
      _id: nanoid(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ingredients: [nanoid(), nanoid()],
      name: 'Бургер #1',
      number: 5005,
      status: 'done',
    },
    {
      _id: nanoid(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ingredients: [nanoid(), nanoid()],
      name: 'Бургер #2',
      number: 5006,
      status: 'pending',
    },
  ],
}

export const orderUserResponseMock: IOrdersResponse = {
  success: true,
  total: 3,
  totalToday: 3,
  orders: [
    {
      _id: nanoid(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ingredients: [nanoid(), nanoid()],
      name: 'Бургер #999',
      number: 5055,
      status: 'done',
    },
    {
      _id: nanoid(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ingredients: [nanoid(), nanoid()],
      name: 'Бургер #777',
      number: 5056,
      status: 'pending',
    },
    {
      _id: nanoid(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ingredients: [nanoid(), nanoid()],
      name: 'Бургер #888',
      number: 5057,
      status: 'pending',
    },
  ],
}

export const orderByNumberRequestBodyMock: IOrderByNumberBody = {
  isPrivate: true,
  orderNumber: 5000,
}

export const orderByNumberResponseMock: IOrderByIDResponse = {
  orders: orderResponseMock.orders,
}

export const profileResponseMock: IProfileResponse = {
  success: true,
  user: userMock,
}

export const wsConnectPayloadMock: {
  url: string
  onMessageActionType: string
} = {
  url: 'WS Connection Url',
  onMessageActionType: 'Any Action',
}

export const wsOnErrorPayloadMock: { error: string } = {
  error: new Error(`Web socket error using url:"URL"`).message,
}

export const forgotPasswordRequestBodyMock: IPasswordForgotRequestBody = {
  email: userMock.email,
}

export const forgotPasswordResponseMock: TPasswordForgotResponse = {
  message: 'The code has been sent',
  success: true,
}

export const resetPasswordRequestBodyMock: IPasswordResetRequestBody = {
  token: 'token',
  password: 'password',
}

export const resetPasswordResponseMock: TPasswordForgotResponse = {
  message: 'The password has been reset',
  success: true,
}

export const orderCheckoutRequestBodyMock: IOrderDetailsBody = {
  ingredients: ingredientsData.slice(0, 5).map((ingredient) => ingredient._id),
}

export const orderCheckoutResponseMock: IOrderDetailsResponse = {
  name: 'Super Duper Burger',
  order: { number: 5656 },
  success: true,
}

export const mocks = {
  user: userMock,
  signIn: {
    requestBody: signInRequestBodyMock,
    response: authDefaultResponseMock,
  },
  signUp: {
    requestBody: signUpRequestBodyMock,
    response: authDefaultResponseMock,
  },
  signOut: {
    response: signOutResponseMock,
  },
  ordersAll: {
    response: orderResponseMock,
  },
  orders: {
    response: orderResponseMock,
  },
  ordersUser: {
    response: orderUserResponseMock,
  },
  orderByNumber: {
    requestBody: orderByNumberRequestBodyMock,
    response: orderByNumberResponseMock,
  },
  profile: {
    response: profileResponseMock,
  },
  profileUpdate: {
    response: profileResponseMock,
  },
  forgotPassword: {
    requestBody: forgotPasswordRequestBodyMock,
    response: forgotPasswordResponseMock,
  },
  resetPassword: {
    requestBody: resetPasswordRequestBodyMock,
    response: resetPasswordResponseMock,
  },
  orderCreate: {
    requestBody: orderCheckoutRequestBodyMock,
    response: orderCheckoutResponseMock,
  },
}
