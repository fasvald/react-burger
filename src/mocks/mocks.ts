/* eslint-disable import/prefer-default-export */

import { nanoid } from 'nanoid'

import {
  ISignInRequestBody,
  ISignOutResponse,
  ISignUpRequestBody,
  TSignInResponse,
} from '@common/models/auth.model'
import {
  IOrderByIDResponse,
  IOrderByNumberBody,
  IOrdersResponse,
} from '@common/models/orders.model'
import { IAuthState } from '@services/slices/auth.slice'

const userMock: IAuthState['user'] = {
  name: 'Hanz',
  email: 'mock@mock.com',
}

const signInRequestBodyMock: ISignInRequestBody = {
  email: 'mock@mock.com',
  password: 'mockPassword',
}

const authDefaultResponseMock: TSignInResponse = {
  success: true,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: userMock,
}

const signUpRequestBodyMock: ISignUpRequestBody = {
  email: userMock.email,
  name: userMock.name,
  password: 'mockPassword',
}

const signOutResponseMock: ISignOutResponse = {
  success: true,
  message: 'Sign Out',
}

const orderResponseMock: IOrdersResponse = {
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
      status: 'done',
    },
  ],
}

const orderByNumberRequestBodyMock: IOrderByNumberBody = {
  isPrivate: true,
  orderNumber: 5000,
}

const orderByNumberResponseMock: IOrderByIDResponse = {
  orders: orderResponseMock.orders,
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
  orderByNumber: {
    requestBody: orderByNumberRequestBodyMock,
    response: orderByNumberResponseMock,
  },
}
