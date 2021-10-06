/**
 * Set token for further injection in header
 *
 * @param accessToken Access token
 *
 * @returns Token for header
 */
export const setBearerToken = (accessToken: string): string => {
  return `Bearer ${accessToken}`
}

/**
 * Parse token from server response (bearer token)
 *
 * @param accessToken Access Token from the server
 *
 * @return Parsed token
 */
export const getBearerToken = (accessToken: string): string => {
  return accessToken.split(' ').pop() as string
}
