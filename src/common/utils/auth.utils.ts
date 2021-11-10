import { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

import { API_ENDPOINTS } from '@common/constants/api.constant'
import { IAuthRefreshTokenRequestBody, IAuthRefreshTokenResponse } from '@common/models/auth.model'
import apiInstance from '@services/interceptors/client.interceptor'

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

/**
 * Refresh auth token
 *
 * @returns Refreshed auth token
 */
export const refreshAuthToken = async (): Promise<IAuthRefreshTokenResponse> => {
  const refreshToken = Cookies.get('sb-refreshToken')

  if (!refreshToken) {
    return Promise.reject(new Error('Refresh token is empty.'))
  }

  const response = await apiInstance.post<
    IAuthRefreshTokenRequestBody,
    AxiosResponse<IAuthRefreshTokenResponse>
  >(API_ENDPOINTS.token, { token: refreshToken }, {})

  Cookies.set('sb-authToken', getBearerToken(response.data.accessToken), {
    expires: getTokenExpirationDate(),
    path: '/',
  })

  Cookies.set('sb-refreshToken', response.data.refreshToken, {
    path: '/',
  })

  return response.data
}

/**
 * Get "Authorized" header for auth related requests (also to be sure that sending empty string will trigger non-auth errors)
 *
 * @returns Authorization header
 */
export const getAuthorizedHeader = (): { Authorization: string } => {
  const refreshToken = Cookies.get('sb-refreshToken')
  const authToken = Cookies.get('sb-authToken')

  return {
    Authorization: refreshToken ? `Bearer ${authToken}` : '',
  }
}
