import { ResponseComposition, rest, RestContext, RestRequest } from 'msw'

import { BASE_URL, API_ENDPOINTS } from '@common/constants/api.constant'
import {
  ISignInRequestBody,
  ISignOutResponse,
  ISignUpRequestBody,
  TSignInResponse,
  TSignUpResponse,
} from '@common/models/auth.model'

import { mocks } from './mocks.constant'

const errorTriggerCb = (req: RestRequest, res: ResponseComposition, ctx: RestContext) =>
  res(ctx.status(401), ctx.json({ error: '' }), ctx.delay(300))

// Handles a POST /auth/login request and triggering error
export const signInErrorHandler = rest.post<ISignInRequestBody, TSignInResponse>(
  `${BASE_URL}${API_ENDPOINTS.signIn}`,
  errorTriggerCb,
)

// Handles a POST /auth/register request and triggering error
export const signUpErrorHandler = rest.post<ISignUpRequestBody, TSignUpResponse>(
  `${BASE_URL}${API_ENDPOINTS.signUp}`,
  errorTriggerCb,
)

// Handles a POST /auth/logout request and triggering error
export const signOutErrorHandler = rest.post<undefined, ISignOutResponse>(
  `${BASE_URL}${API_ENDPOINTS.signOut}`,
  errorTriggerCb,
)

export const handlers = [
  // Handles a POST /auth/login request
  rest.post<ISignInRequestBody, TSignInResponse>(
    `${BASE_URL}${API_ENDPOINTS.signIn}`,
    (req, res, ctx) => res(ctx.json(mocks.signIn.response), ctx.delay(300)),
  ),
  // Handles a POST /auth/register request
  rest.post<ISignUpRequestBody, TSignUpResponse>(
    `${BASE_URL}${API_ENDPOINTS.signUp}`,
    (req, res, ctx) => res(ctx.json(mocks.signIn.response), ctx.delay(300)),
  ),
  // Handles a POST /auth/logout request
  rest.post<undefined, ISignOutResponse>(`${BASE_URL}${API_ENDPOINTS.signOut}`, (req, res, ctx) =>
    res(ctx.json(mocks.signOut.response), ctx.delay(300)),
  ),
]
