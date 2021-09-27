import { TFetchProcess } from '../../common/models/data.model'
import { IOrderDetails } from '../../components/order-details/order-details.model'
import { RootState } from '../../store'

export const orderSelector = (state: RootState): IOrderDetails | null => state.orderDetails.order

export const orderCreationStatusSelector = (state: RootState): TFetchProcess =>
  state.orderDetails.status
