import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import Modal from '../modal/Modal'
import UserForm from '../components/form/UserForm'
import {
  fetchAllUsers,
  selectUsers,
  selectUsersError,
  selectUsersLoading,
  addUser,
  deleteUser,
  updateUser
} from '../redux/slices/usersSlice'
import { UserInterface } from '../types/User.interface'

const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector(selectUsers)
  const isLoading = useSelector(selectUsersLoading)
  const error = useSelector(selectUsersError)
  const [editingUser, setEditingUser] = useState<Partial<UserInterface> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAllUsers('https://jsonplaceholder.typicode.com/users?_limit=5') as any)
  }, [dispatch])

  const handleAddUser = (newUser: Partial<UserInterface>) => {
    dispatch(addUser(newUser))
    setIsModalOpen(false)
  }

  const handleDeleteUser = (userId: number) => {
    dispatch(deleteUser(userId))
  }

  const handleEditUser = (user: UserInterface) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleUpdateUser = (updatedUser: Partial<UserInterface>) => {
    if (editingUser && editingUser.id !== undefined) {
      const updatedUserData: UserInterface = {
        id: editingUser.id,
        name: updatedUser.name || editingUser.name || '',
        username: updatedUser.username || editingUser.username || '',
        email: updatedUser.email || editingUser.email || '',
        phone: updatedUser.phone || editingUser.phone || '',
        website: updatedUser.website || editingUser.website || ''
      }

      dispatch(updateUser(updatedUserData))
      setEditingUser(null)
      setIsModalOpen(false)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  return (
    <div className="users-page">
      <h1>Users Page</h1>
      <div className="centered">
        <button className="button-post" onClick={() => setIsModalOpen(true)}>
          Add new User
        </button>
      </div>
      {isLoading && <p className="loading">Loading...</p>}
      {error && <h2 className="error">{error}</h2>}
      {!isLoading && !error && (
        <ul className="users-list">
          {!!users?.length &&
            users.map((user: UserInterface) => (
              <li key={user.id}>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
                <div className="button-icons">
                  <button onClick={() => handleEditUser(user)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <UserForm onSubmit={editingUser ? handleUpdateUser : handleAddUser} userToEdit={editingUser} />
        </Modal>
      )}
    </div>
  )
}

export default Users
