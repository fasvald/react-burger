/* eslint-disable import/prefer-default-export */

import { IModalRouteLocationState } from '@common/models/routing.model'

/**
 * Check if passing object is instance of 'ModalRouteLocationState' interface
 *
 * @param object Passing object to check
 * @returns Result of checking
 *
 * @link https://stackoverflow.com/questions/14425568/interface-type-check-with-typescript
 */
export const isInstanceOfModalRouteLocationState = (
  object: unknown,
): object is IModalRouteLocationState => {
  return (
    !!object &&
    Object.prototype.hasOwnProperty.call(object, 'isModal') &&
    Object.prototype.hasOwnProperty.call(object, 'background')
  )
}
