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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatchError, setPasswordMatchError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setPasswordMatchError(true)
      return
    }

    dispatch(registerUserSuccess())

    onClose()
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <h3>Registration Form</h3>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username..."
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
      <label htmlFor="confirmPassword">Confirm Password:</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value)
          setPasswordMatchError(false)
        }}
        placeholder="Confirm password..."
        required
      />
      {passwordMatchError && <p className="error-message">Passwords do not match!</p>}
      <button type="submit">Register</button>
    </form>
  )
}

export default RegistrationForm
