import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { UserInterface } from '../../types/User.interface'
import { AppDispatch, RootState } from '../store'

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

export const fetchAllUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await fetch('http://localhost:3000/users')
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  const data = await response.json()
  return data.users
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUserSuccess(state, action: PayloadAction<UserInterface>) {
      state.users.push(action.payload)
    },
    deleteUserSuccess(state, action: PayloadAction<number>) {
      state.users = state.users.filter((user) => user._id !== action.payload)
    },
    updateUserSuccess(state, action: PayloadAction<UserInterface>) {
      const updatedUser = action.payload
      const index = state.users.findIndex((user) => user._id === updatedUser._id)
      if (index !== -1) {
        state.users[index] = updatedUser
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<UserInterface[]>) => {
        state.users = action.payload
        state.isLoading = false
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch users'
      })
  }
})

export const { addUserSuccess, deleteUserSuccess, updateUserSuccess } = usersSlice.actions

export const addUser = (newUserData: Partial<UserInterface>) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUserData)
    })
    const data = await response.json()
    dispatch(addUserSuccess(data))
    dispatch(fetchAllUsers())
  } catch (error) {
    console.error('Failed to add user', error)
  }
}

export const deleteUser = (userId: number) => async (dispatch: AppDispatch) => {
  try {
    await fetch(`http://localhost:3000/users/${userId}`, {
      method: 'DELETE'
    })
    dispatch(deleteUserSuccess(userId))
    dispatch(fetchAllUsers())
  } catch (error) {
    console.error('Failed to delete user', error)
  }
}

export const updateUser = (updatedUser: UserInterface) => async (dispatch: AppDispatch) => {
  try {
    const { _id, ...userData } = updatedUser
    const response = await fetch(`http://localhost:3000/users/${updatedUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    const data = await response.json()
    dispatch(updateUserSuccess(data))
    dispatch(fetchAllUsers())
  } catch (error) {
    console.error('Failed to update user', error)
  }
}

export const selectUsers = (state: RootState) => state.users.users
export const selectUsersLoading = (state: RootState) => state.users.isLoading
export const selectUsersError = (state: RootState) => state.users.error

export default usersSlice.reducer
