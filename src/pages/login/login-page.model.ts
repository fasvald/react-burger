import { TSignInResponse } from '../../common/models/auth.model'
import { TFetchProcess } from '../../common/models/data.model'

export interface ILoginPageState {
  status: TFetchProcess
  res: TSignInResponse | null
}
