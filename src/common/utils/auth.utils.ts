/**
 * Set token for further injection in header
 *
 * @param accessToken Access token
 *
 * @returns Token for header
 */
export const setBearerToken = (accessToken: string): string => `Bearer ${accessToken}`

/**
 * Parse token from server response (bearer token)
 *
 * @param accessToken Access Token from the server
 *
 * @return Parsed token
 */
export const getBearerToken = (accessToken: string): string =>
  accessToken.split(' ').pop() as string

/**
 * Returns tokens max age (expiration) value, 20 min
 *
 * @returns Token expiration value
 */
export const getTokenExpirationDate = (): Date => new Date(Date.now() + 20 * 60000)
