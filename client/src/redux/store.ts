import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import usersReducer from './slices/usersSlice'
import authReducer from './slices/authSlice'
import postsReducer from './slices/postsSlice'
import productsReducer from './slices/productsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
    products: productsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
