interface IAuthDefaultResponse {
  success: boolean
  user: IAuthUser
  accessToken: TAccessToken
  refreshToken: TRefreshToken
}

interface IPasswordResetDefaultResponse {
  success: boolean
  message: string
}

export type TAccessToken = string

export type TRefreshToken = string

export type TSignInResponse = IAuthDefaultResponse

export type TSignUpResponse = IAuthDefaultResponse

export type TPasswordForgotResponse = IPasswordResetDefaultResponse

export type TPasswordResetResponse = IPasswordResetDefaultResponse

export interface IAuthUser {
  email: string
  name: string
}

export interface ISignInRequestBody {
  email: string
  password: string
}

export interface ISignUpRequestBody extends ISignInRequestBody {
  name: string
}

export interface IPasswordForgotRequestBody {
  email: string
}

export interface IPasswordResetRequestBody {
  password: string
  token: string
}

export interface IProfileResponse {
  success: boolean
  user: IAuthUser
}
