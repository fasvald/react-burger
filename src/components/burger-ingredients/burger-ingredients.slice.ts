/* eslint-disable no-param-reassign */

import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { memoize } from 'lodash'

import { API_ENDPOINTS } from '@common/constants/api.constant'
import { IAxiosSerializedError, IUnknownDefaultError } from '@common/models/errors.model'
import { TBurgerIngredientType, TFetchProcess } from '@common/models/fetch-process.model'
import { getSerializedAxiosError } from '@common/utils/errors.utils'
import apiInstance from '@services/interceptors/client.interceptor'
import { RootState } from '@store'

import { IBurgerIngredient, IBurgerIngredientFetch } from './burger-ingredients.model'

export interface IBurgerIngredientsState {
  status: TFetchProcess
  items: IBurgerIngredient[]
}

const initialState: IBurgerIngredientsState = {
  status: 'idle',
  items: [],
}

export const ingredientsSelector = (state: RootState): IBurgerIngredient[] =>
  state.burgerIngredients.items

export const ingredientsFetchStatusSelector = (state: RootState): TFetchProcess =>
  state.burgerIngredients.status

export const selectIngredientsByType = createSelector([ingredientsSelector], (ingredients) =>
  memoize((type: TBurgerIngredientType) =>
    ingredients.filter((ingredient) => ingredient.type === type),
  ),
)

export const selectIngredientByID = createSelector([ingredientsSelector], (ingredients) =>
  memoize((id: string) => ingredients.find((ingredient) => ingredient._id === id)),
)

export const selectIngredientsByIDs = createSelector([ingredientsSelector], (ingredients) =>
  memoize((ids: string[]) =>
    // We could use this `filter(ingredients, (ingredient) => ids.includes(ingredient._id))`, but we need to preserve duplications
    ids.reduce((acc: IBurgerIngredient[], curr: string) => {
      const ingredient = ingredients.find((item) => item._id === curr)

      if (ingredient) {
        acc.push(ingredient)
      }

      return acc
    }, []),
  ),
)

/**
 * NOTE: Could be changed via RTK Query feature => createAPI, but it's a little bit harder and there are
 * a lot of theory and new info how to use it. I do not like that in that case all selectors should be like
 * an http query and you still need to inject this thing as extra reducer. Use createApi and injectEndpoints, from
 * this link => https://redux-toolkit.js.org/rtk-query/usage/code-splitting.
 *
 * Anyway this thing https://redux-toolkit.js.org/rtk-query/overview is very cool, but for me it seems like
 * overcomplicated and overwhelming for this kind of project. Personally for me I kinda understand how to work
 * with it... I need to create one emptyBaseApi, set reducerPath, inject endpoints, pass to store creation function
 * and using it inside extra reducers for some of the store sections, additionally rewrite all the selectors which be
 * under createApi method.
 *
 * Still there are plenty of advantages, but I am going to use createAsyncThunk for this project. Also because of
 * integration with Axios library for HTTP requests.
 */
export const getIngredients = createAsyncThunk<
  IBurgerIngredient[],
  undefined,
  {
    state: RootState
    signal: AbortSignal
    rejectValue: IAxiosSerializedError | string
  }
>(
  'ingredients/fetchAll',
  async (_, thunkApi) => {
    try {
      const source = axios.CancelToken.source()
      thunkApi.signal.addEventListener('abort', () => {
        source.cancel('Operation stop the work.')
      })

      const response = await apiInstance.get<IBurgerIngredientFetch>(API_ENDPOINTS.ingredients, {
        cancelToken: source.token,
      })

      return response.data.data
    } catch (err) {
      // https://github.com/microsoft/TypeScript/issues/20024
      // https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
      if (axios.isCancel(err)) {
        return thunkApi.rejectWithValue(
          'Ingredients fetching stop the work. This has been aborted!',
        )
      }

      if (axios.isAxiosError(err)) {
        return thunkApi.rejectWithValue(getSerializedAxiosError(err) as IAxiosSerializedError)
      }

      return thunkApi.rejectWithValue((err as IUnknownDefaultError).message)
    }
  },
  {
    // eslint-disable-next-line consistent-return
    condition: (_, thunkApi) => {
      const { burgerIngredients } = thunkApi.getState()
      const fetchStatus = burgerIngredients?.status

      if (fetchStatus === 'loaded' || fetchStatus === 'loading') {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
    },
  },
)

export const burgerIngredientsSlice = createSlice({
  name: 'burgerIngredients',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getIngredients.pending, (state) => {
      state.status = 'loading'
      state.items = []
    })
    builder.addCase(getIngredients.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.items = action.payload
    })
    builder.addCase(getIngredients.rejected, (state) => {
      state.status = 'error'
      state.items = []
    })
  },
})

export default burgerIngredientsSlice.reducer
