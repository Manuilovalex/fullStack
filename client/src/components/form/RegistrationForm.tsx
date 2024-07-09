import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { registerUserSuccess } from '../../redux/slices/authSlice'

interface RegistrationFormProps {
  onClose: () => void
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    dispatch(registerUserSuccess())
    onClose()
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <h3>Login Form</h3>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter userName..."
        required
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email..."
        required
      />

      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password..."
        required
      />
      <button type="submit">Register</button>
    </form>
  )
}

export default RegistrationForm
