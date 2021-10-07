export interface IUnknownDefaultError {
  message: string
}

export interface IAxiosSerializedError {
  message: string
  status: number
  statusText: string
  data: {
    message: string
    success: boolean
  }
}
