/* eslint-disable import/prefer-default-export */

import {
  ISignInRequestBody,
  ISignOutResponse,
  ISignUpRequestBody,
  TSignInResponse,
} from '@common/models/auth.model'
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
}
