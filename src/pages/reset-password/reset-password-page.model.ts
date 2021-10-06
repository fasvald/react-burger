import { TPasswordResetResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'

export interface IResetPasswordPageState {
  status: TFetchProcess
  res: TPasswordResetResponse | null
}
