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

const UsersPage = () => {
  const dispatch = useDispatch()
  const users = useSelector(selectUsers)
  const isLoading = useSelector(selectUsersLoading)
  const error = useSelector(selectUsersError)
  const [editingUser, setEditingUser] = useState<Partial<UserInterface> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAllUsers() as any)
  }, [dispatch])

  const handleAddUser = () => {
    setIsModalOpen(true)
    setEditingUser(null)
  }

  const handleEditUserClick = (user: UserInterface) => {
    setIsModalOpen(true)
    setEditingUser(user)
  }

  const handleDeleteUser = (userId: number) => {
    dispatch(deleteUser(userId) as any)
  }

  const handleUpdateUser = (updatedUser: Partial<UserInterface>) => {
    if (editingUser && editingUser._id !== undefined) {
      const { _id, ...updatedData } = updatedUser

      const updatedUserData: UserInterface = {
        _id: editingUser._id,
        username: updatedData.username || editingUser.username || '',
        age: updatedData.age || editingUser.age || 0,
        email: updatedData.email || editingUser.email || ''
      }

      dispatch(updateUser(updatedUserData)as any)
      setEditingUser(null)
      setIsModalOpen(false)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleAddOrUpdateUser = (newUserData: Partial<UserInterface>) => {
    if (editingUser) {
      handleUpdateUser(newUserData as UserInterface)
    } else {
      dispatch(addUser(newUserData as Partial<UserInterface>) as any)
      setIsModalOpen(false)
    }
  }

  return (
    <div className="users-page">
      <h1>Users Page</h1>
      <div className="centered">
        <button className="button-user" onClick={handleAddUser}>
          Add new User
        </button>
      </div>
      {isLoading && <p className="loading">Loading...</p>}
      {error && <h2 className="error">{error}</h2>}
      {!isLoading && !error && (
        <ul className="users-list">
          {users.map((user: UserInterface) => (
            <li key={user._id}>
              <div>
                <strong>Name: {user.username}</strong>
                <p>Age: {user.age}</p>
                <p>Email: {user.email}</p>
              </div>
              <div className="button-icons">
                <button onClick={() => handleEditUserClick(user)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDeleteUser(user._id)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <UserForm onSubmit={handleAddOrUpdateUser} userToEdit={editingUser} />
        </Modal>
      )}
    </div>
  )
}

export default UsersPage
