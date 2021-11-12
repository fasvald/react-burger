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

export interface IOrdersResponse {
  success: boolean
  orders: IOrder[]
  total: number
  totalToday: number
}
