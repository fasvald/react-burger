export type TOrderStatuses = 'created' | 'pending' | 'done'

export interface IOrder {
  ingredients: string[]
  _id: string
  status: TOrderStatuses
  number: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface IOrderByNumberBody {
  orderNumber: number
  isPrivate: boolean
}

export interface IOrdersResponse {
  success: boolean
  orders: IOrder[]
  total: number
  totalToday: number
}

export interface IOrderByIDResponse {
  orders: IOrder[]
}
