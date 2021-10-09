/* eslint-disable import/prefer-default-export */

import { IAxiosSerializedError } from '../models/errors.model'

/**
 * Check if passing object is instance of 'AxiosSerializedError' interface
 *
 * @param object Passing object to check
 * @returns Result of checking
 *
 * @link https://stackoverflow.com/questions/14425568/interface-type-check-with-typescript
 */
export const isInstanceOfAxiosSerializedError = (
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
