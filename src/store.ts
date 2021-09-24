import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit'
import logger from 'redux-logger'

import rootReducer from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: { burgerIngredients: BurgerIngredientsState, etc., ... }
export type AppDispatch = typeof store.dispatch

// Inferred type from ThunkAction
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

export default store
