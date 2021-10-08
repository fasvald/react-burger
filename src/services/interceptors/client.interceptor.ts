import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { get, set } from 'lodash'

import { BASE_URL } from '../../common/constants/api.constant'
import { refreshAuthToken } from '../../common/utils/auth.utils'

/**
 * Initialize interceptor for handling JWT token expiration issue
 *
 * @link https://www.bezkoder.com/axios-interceptors-refresh-token/
 * @link https://thedutchlab.com/blog/using-axios-interceptors-for-refreshing-your-api-token
 * @link https://github.com/axios/axios#interceptors
 */

interface IAxiosRequestConfigModified extends AxiosRequestConfig {
  _retry?: boolean
}

const apiInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
})

apiInstance.interceptors.request.use(
  (config) => {
    const authToken = Cookies.get('sb-authToken')

    // Only apply 'Authorization' header when its necessary
    if (get(config, 'headers.Authorization') && authToken) {
      set(config, 'headers.Authorization', `Bearer ${authToken}`)
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest: IAxiosRequestConfigModified = err.config

    if ((err as AxiosError).response?.status === 403 && !originalRequest?._retry) {
      originalRequest._retry = true

      try {
        const { accessToken } = await refreshAuthToken()

        set(apiInstance, 'defaults.headers.common.Authorization', accessToken)

        return apiInstance(originalRequest)
      } catch (_err) {
        if (err.response && err.response.data) {
          return Promise.reject(err.response.data)
        }

        return Promise.reject(err)
      }
    }

    if (
      (err as AxiosError).response?.status === 401 &&
      (err as AxiosError).response?.data &&
      (err as AxiosError<{ message: string; success: boolean }>).response?.data.message ===
        'Token is invalid'
    ) {
      return Promise.reject((err as AxiosError).response?.data)
    }

    return Promise.reject(err)
  },
)

export default apiInstance
