import { ISignInRequestBody, TSignInResponse } from '@common/models/auth.model'
import { IAuthState } from '@services/slices/auth.slice'

export const userMock: IAuthState['user'] = {
  name: 'Hanz',
  email: 'mock@mock.com',
}

export const signInRequestBodyMock: ISignInRequestBody = {
  email: 'mock@mock.com',
  password: 'mockPassword',
}

export const signInResponseMock: TSignInResponse = {
  success: true,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: userMock,
}

export const mocks = {
  user: userMock,
  signIn: {
    requestBody: signInRequestBodyMock,
    response: signInResponseMock,
  },
}
