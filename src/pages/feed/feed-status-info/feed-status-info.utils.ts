/* eslint-disable import/prefer-default-export */

import { nanoid } from 'nanoid'

/**
 * Generate array of unique id via nanoid lib
 *
 * @param length Count of id
 * @returns Array of unique id
 */
export const generateUniqueIDs = (length: number): string[] =>
  [...new Array(length)].map(() => nanoid())
