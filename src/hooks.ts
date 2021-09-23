import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch = (): ThunkDispatch<RootState, unknown, AnyAction> =>
  useDispatch<AppDispatch>()

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
