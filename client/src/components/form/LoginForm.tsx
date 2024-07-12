import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { login } from '../../redux/slices/authSlice'

interface LoginFormProps {
  onClose: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(login())
    onClose()
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
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm
