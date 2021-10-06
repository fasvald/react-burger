import { TFetchProcess } from '../../common/models/data.model'

export interface IResetPasswordRequestBody {
  password: string
  token: string
}

export interface IResetPasswordResponse {
  success: boolean
  message: string
}

export interface IResetPasswordState extends IResetPasswordResponse {
  status: TFetchProcess
}
