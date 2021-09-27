import { TFetchProcess } from '../../common/models/data.model'

export interface IOrderDetails {
  name: string
  order: {
    number: number
  }
}

export interface IOrderDetailsBody {
  ingredients: string[]
}

export interface IOrderDetailsResponse extends IOrderDetails {
  success: boolean
}

export interface IUseOrderDetails {
  order: IOrderDetails | null
  status: TFetchProcess
  controller: AbortController
  createOrder: (body: IOrderDetailsBody, cb: () => void) => Promise<void>
}

export interface IOrderDetailsProps {
  orderDetails: IOrderDetails
}

export interface IOrderDetailsState {
  status: TFetchProcess
  order: IOrderDetails | null
}
