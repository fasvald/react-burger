import { TFetchProcess } from '../../common/models/data.model'

export interface IForgotPasswordRequestBody {
  email: string
}

export interface IForgotPasswordResponse {
  success: boolean
  message: string
}

export interface IForgotPasswordState extends IForgotPasswordResponse {
  status: TFetchProcess
}
