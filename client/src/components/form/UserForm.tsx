import { FormEvent, useEffect, useState } from 'react'
import { UserInterface } from '../../types/User.interface'

interface UserFormProps {
  onSubmit: (user: Partial<UserInterface>) => void
  userToEdit?: Partial<UserInterface> | null
}

const UserForm = ({ onSubmit, userToEdit }: UserFormProps) => {
  const [username, setUsername] = useState('')
  const [age, setAge] = useState<number | string>('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.username || '')
      setAge(userToEdit.age || '')
      setEmail(userToEdit.email || '')
    }
  }, [userToEdit])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newUser: Partial<UserInterface> = { username, age: Number(age), email }
    onSubmit(newUser)
    setUsername('')
    setAge('')
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h3>{userToEdit ? 'Update User' : 'Add new user'}</h3>
      <div className="form-group">
        <label htmlFor="userUsername">Username:</label>
        <input type="text" id="userUsername" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="userAge">Age:</label>
        <input type="number" id="userAge" value={age} onChange={(e) => setAge(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="userEmail">Email:</label>
        <input type="email" id="userEmail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <button type="submit">{userToEdit ? 'Update User' : 'Add new user'}</button>
    </form>
  )
}

export default UserForm
