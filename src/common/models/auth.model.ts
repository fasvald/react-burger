interface IAuthDefaultResponse {
  success: boolean
  user: IAuthUser
  accessToken: TAcessToken
  refreshToken: TRefreshToken
}

interface IPasswordResetDefaultResponse {
  success: boolean
  message: string
}

export type TAcessToken = string

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

// For auth.slice initial state purpose
export interface IAuthState {
  isLoggedIn: boolean
  user: IAuthUser | null
  accessToken: string | null
  refreshToken: string | null
}

// For auth.slice payloads in action creators
export interface IAuthPayloadActionData {
  user: IAuthUser
  accessToken: string
  refreshToken: string
}
