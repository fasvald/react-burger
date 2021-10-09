/* eslint-disable import/prefer-default-export */

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
