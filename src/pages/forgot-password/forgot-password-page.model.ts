import { TPasswordForgotResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'

export interface IForgotPasswordPageState {
  status: TFetchProcess
  res: TPasswordForgotResponse | null
}
