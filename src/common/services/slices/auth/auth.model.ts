import { TFetchProcess } from '../../../models/data.model'

export interface IAuthState {
  status: TFetchProcess
  user: {
    email: string
    name: string
  }
  accessToken: string
  refreshToken: string
}

export interface IAuthSignUpResponse extends IAuthState {
  success: boolean
}

export interface IAuthSignUpBodyRequest {
  email: string
  password: string
  name: string
}
