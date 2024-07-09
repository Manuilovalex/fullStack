import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInterface } from '../../types/User.interface'
import { AppDispatch } from '../store'

interface UsersState {
  users: UserInterface[]
  isLoading: boolean
  error: string | null
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchAllUsersStart(state) {
      state.isLoading = true
      state.error = null
    },
    fetchAllUsersSuccess(state, action: PayloadAction<UserInterface[]>) {
      state.users = action.payload
      state.isLoading = false
    },
    fetchAllUsersFailure(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    addUser(state, action: PayloadAction<Partial<UserInterface>>) {
      state.users.push({ ...action.payload, id: Date.now() } as UserInterface)
    },
    deleteUser(state, action: PayloadAction<number>) {
      state.users = state.users.filter((user) => user.id !== action.payload)
    },
    updateUser(state, action: PayloadAction<UserInterface>) {
      const index = state.users.findIndex((user) => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    }
  }
})

export const { fetchAllUsersStart, fetchAllUsersSuccess, fetchAllUsersFailure, addUser, deleteUser, updateUser } =
  usersSlice.actions

export const fetchAllUsers = (url: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchAllUsersStart())
  try {
    const response = await fetch(url)
    const data = await response.json()
    dispatch(fetchAllUsersSuccess(data))
  } catch (error) {
    dispatch(fetchAllUsersFailure((error as Error).toString()))
  }
}

export const selectUsers = (state: any) => state.users.users
export const selectUsersLoading = (state: any) => state.users.isLoading
export const selectUsersError = (state: any) => state.users.error

export default usersSlice.reducer
