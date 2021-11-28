import { ResponseComposition, rest, RestContext, RestRequest } from 'msw'

import { BASE_URL, API_ENDPOINTS } from '@common/constants/api.constant'
import { ingredientsData } from '@common/constants/ingredients-mock.constant'
import {
  IAuthUser,
  IPasswordForgotRequestBody,
  IPasswordResetRequestBody,
  IProfileResponse,
  ISignInRequestBody,
  ISignOutResponse,
  ISignUpRequestBody,
  TPasswordForgotResponse,
  TPasswordResetResponse,
  TSignInResponse,
  TSignUpResponse,
} from '@common/models/auth.model'
import {
  IOrderByIDResponse,
  IOrderByNumberBody,
  IOrdersResponse,
} from '@common/models/orders.model'
import { IBurgerIngredient } from '@components/burger-ingredients/burger-ingredients.model'

import { mocks } from './mocks'

// NOTE: We can use https://mswjs.io/docs/recipes/custom-response-composition#using-a-composition instead of delay

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

// Handles a GET /orders/all request and triggering error
export const ordersAllErrorHandler = rest.get<undefined, IOrdersResponse>(
  `${BASE_URL}${API_ENDPOINTS.ordersAll}`,
  errorTriggerCb,
)

// Handles a GET /orders request and triggering error
export const ordersUsersErrorHandler = rest.get<undefined, IOrdersResponse>(
  `${BASE_URL}${API_ENDPOINTS.orders}`,
  errorTriggerCb,
)

// Handles a GET /orders/:orderNumber request and triggering error
export const orderByNumberErrorHandler = rest.get<IOrderByNumberBody, IOrderByIDResponse>(
  `${BASE_URL}${API_ENDPOINTS.orders}/:orderNumber`,
  errorTriggerCb,
)

// Handles a GET /auth/user request and triggering error
export const profileErrorHandler = rest.get<undefined, IOrdersResponse>(
  `${BASE_URL}${API_ENDPOINTS.profile}`,
  errorTriggerCb,
)

// Handles a PATCH /auth/user request and triggering error
export const profilePatchErrorHandler = rest.patch<undefined, IOrdersResponse>(
  `${BASE_URL}${API_ENDPOINTS.profile}`,
  errorTriggerCb,
)

// Handles a POST /password-reset request and triggering error
export const forgotPasswordErrorHandler = rest.post<
  IPasswordForgotRequestBody,
  TPasswordForgotResponse
>(`${BASE_URL}${API_ENDPOINTS.passwordForgot}`, errorTriggerCb)

// Handles a POST /password-reset/reset request and triggering error
export const resetPasswordErrorHandler = rest.post<
  IPasswordForgotRequestBody,
  TPasswordForgotResponse
>(`${BASE_URL}${API_ENDPOINTS.passwordReset}`, errorTriggerCb)

// Handles a GET /ingredients request and triggering error
export const ingredientsErrorHandler = rest.get<undefined, { data: IBurgerIngredient[] }>(
  `${BASE_URL}${API_ENDPOINTS.ingredients}`,
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
  // Handles a GET /orders/all request
  rest.get<undefined, IOrdersResponse>(`${BASE_URL}${API_ENDPOINTS.ordersAll}`, (req, res, ctx) =>
    res(ctx.json(mocks.ordersAll.response), ctx.delay(300)),
  ),
  // Handles a GET /orders request
  rest.get<undefined, IOrdersResponse>(`${BASE_URL}${API_ENDPOINTS.orders}`, (req, res, ctx) =>
    res(ctx.json(mocks.ordersAll.response), ctx.delay(300)),
  ),
  // Handles a GET /orders/:orderNumber request
  rest.get<IOrderByNumberBody, IOrderByIDResponse>(
    `${BASE_URL}${API_ENDPOINTS.orders}/:orderNumber`,
    (req, res, ctx) => res(ctx.json(mocks.orderByNumber.response), ctx.delay(300)),
  ),
  // Handles a GET /auth/user request
  rest.get<undefined, IProfileResponse>(`${BASE_URL}${API_ENDPOINTS.profile}`, (req, res, ctx) =>
    res(ctx.json(mocks.profile.response), ctx.delay(300)),
  ),
  // Handles a PATCH /auth/user request
  rest.patch<IAuthUser, IProfileResponse>(`${BASE_URL}${API_ENDPOINTS.profile}`, (req, res, ctx) =>
    res(ctx.json(mocks.profile.response), ctx.delay(300)),
  ),
  // Handles a POST /password-reset request
  rest.post<IPasswordForgotRequestBody, TPasswordForgotResponse>(
    `${BASE_URL}${API_ENDPOINTS.passwordForgot}`,
    (req, res, ctx) => res(ctx.json(mocks.forgotPassword.response), ctx.delay(300)),
  ),
  // Handles a POST /password-reset/reset request
  rest.post<IPasswordResetRequestBody, TPasswordResetResponse>(
    `${BASE_URL}${API_ENDPOINTS.passwordReset}`,
    (req, res, ctx) => res(ctx.json(mocks.resetPassword.response), ctx.delay(300)),
  ),
  // Handles a GET /ingredients request
  rest.get<undefined, { data: IBurgerIngredient[] }>(
    `${BASE_URL}${API_ENDPOINTS.ingredients}`,
    (req, res, ctx) => res(ctx.json({ data: ingredientsData }), ctx.delay(300)),
  ),
]
