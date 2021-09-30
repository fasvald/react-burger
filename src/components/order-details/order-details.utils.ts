import { IOrderDetailsBody } from './order-details.model'

export default function getOrderDetailsPostBody(body: IOrderDetailsBody): RequestInit {
  return {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }
}
