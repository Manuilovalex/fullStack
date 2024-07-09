import { FormEvent, useState, useEffect } from 'react'
import { UserInterface } from '../../types/User.interface'

interface UserFormProps {
  onSubmit: (user: Partial<UserInterface>) => void
  userToEdit?: Partial<UserInterface> | null
}

const UserForm = ({ onSubmit, userToEdit }: UserFormProps) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '')
      setUsername(userToEdit.username || '')
      setEmail(userToEdit.email || '')
      setPhone(userToEdit.phone || '')
      setWebsite(userToEdit.website || '')
    }
  }, [userToEdit])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newUser: Partial<UserInterface> = { name, username, email, phone, website }
    onSubmit(newUser)
    setName('')
    setUsername('')
    setEmail('')
    setPhone('')
    setWebsite('')
  }

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h3>Add new user</h3>
      <div className="form-group">
        <label htmlFor="userName">Name:</label>
        <input
          id="userName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name..."
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="userUsername">Username:</label>
        <input
          id="userUsername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username..."
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="userEmail">Email:</label>
        <input
          id="userEmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email..."
          type="email"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="userPhone">Phone:</label>
        <input
          id="userPhone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone..."
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="userWebsite">Website:</label>
        <input
          id="userWebsite"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Enter website..."
          required
        />
      </div>
      <button type="submit">{userToEdit ? 'Update User' : 'Add User'}</button>
    </form>
  )
}

export default UserForm
