import { TFetchProcess } from '@common/models/fetch-process.model'

export type TOrderStatuses = 'created' | 'pending' | 'done'

export interface IOrder {
  ingredients: string[]
  _id: string
  status: TOrderStatuses
  number: number
  createdAt: string
  updatedAt: string
}

export interface IOrdersFeedResponse {
  success: boolean
  orders: IOrder[]
  total: number
  totalToday: number
}

export interface IOrdersFeedPageState {
  status: TFetchProcess
  orders: IOrder[]
  total: number | null
  totalToday: number | null
}

export const initialState: IOrdersFeedPageState = {
  status: 'idle',
  orders: [],
  total: null,
  totalToday: null,
}
