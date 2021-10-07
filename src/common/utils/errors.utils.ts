import { AxiosError } from 'axios'

import { IAxiosSerializedError } from '../models/errors.model'

/**
 * Create a "simplify" error object from Axios Error
 *
 * @param err Passing Axios error
 * @returns "Simplify" error
 */
export const getSerializedAxiosError = (err: AxiosError): Partial<IAxiosSerializedError> => {
  return {
    message: err.message,
    status: err.response?.status,
    statusText: err.response?.statusText,
    data: err.response?.data,
  }
}

/**
 * Check if passing object is instance of 'AxiosSerializedError' interface
 *
 * @param object Passing object to check
 * @returns Result of checking
 *
 * @link https://stackoverflow.com/questions/14425568/interface-type-check-with-typescript
 */
export const instanceOfAxiosSerializedError = (
  object: unknown,
): object is IAxiosSerializedError => {
  return (
    !!object &&
    Object.prototype.hasOwnProperty.call(object, 'message') &&
    Object.prototype.hasOwnProperty.call(object, 'status') &&
    Object.prototype.hasOwnProperty.call(object, 'statusText') &&
    Object.prototype.hasOwnProperty.call(object, 'data')
  )
}
