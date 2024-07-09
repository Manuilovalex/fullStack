import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  isLogin: boolean
}

const initialState: AuthState = {
  isLogin: JSON.parse(localStorage.getItem('isLogin') || 'false')
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isLogin = true
      localStorage.setItem('isLogin', JSON.stringify(true))
    },
    logout(state) {
      state.isLogin = false
      localStorage.setItem('isLogin', JSON.stringify(false))
    },
    registerUserSuccess(state) {
      state.isLogin = true
      localStorage.setItem('isLogin', JSON.stringify(true))
    }
  }
})

export const { login, logout, registerUserSuccess } = authSlice.actions
export default authSlice.reducer
