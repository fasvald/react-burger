import { rest } from 'msw'

import { BASE_URL, API_ENDPOINTS } from '@common/constants/api.constant'
import { ISignInRequestBody, TSignInResponse } from '@common/models/auth.model'

import { mocks } from './mocks.constant'

// Handles a POST /auth/login request and triggering error
export const signInErrorHandler = rest.post<ISignInRequestBody, any>(
  `${BASE_URL}${API_ENDPOINTS.signIn}`,
  (req, res, ctx) => {
    // We don't need to put here any specific error yet
    return res(ctx.status(401), ctx.json({ error: '' }), ctx.delay(300))
  },
)

export const handlers = [
  // Handles a POST /auth/login request
  rest.post<ISignInRequestBody, TSignInResponse>(
    `${BASE_URL}${API_ENDPOINTS.signIn}`,
    (req, res, ctx) => {
      return res(ctx.json(mocks.signIn.response), ctx.delay(300))
    },
  ),
]
