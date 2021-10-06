import { TSignUpResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'

export interface IRegisterPageState {
  status: TFetchProcess
  res: TSignUpResponse | null
}
