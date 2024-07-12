import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { login } from '../../redux/slices/authSlice'
import axiosInstance from '../../utils/axiosInstance'

interface LoginFormProps {
  onClose: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.post('/login', { email, password })
      if (response.status === 200) {
        dispatch(login())
        onClose()
      }
    } catch (error: any) {
      setError('Login failed: Incorrect email or password.')
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h3>Login Form</h3>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email..."
        required
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password..."
        required
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm
