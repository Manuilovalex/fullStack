import { useState, useEffect} from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { TodoProviderPropsInterface } from '../../types/todo/TodoProviderProps.interface.ts'
import { TodoInterface } from '../../types/todo/Todo.interface.ts'
import { TodoContext } from '../../context/TodoContext.ts'
import { initialState } from '../../context/initialState.ts'

const TodoProvider = ({ children }: TodoProviderPropsInterface) => {
  const [todos, setTodos] = useState<TodoInterface[]>(initialState.todos)
  const [isLoading, setIsLoading] = useState<boolean>(initialState.isLoading)
  const [error, setError] = useState<string | null>(initialState.error)

  useEffect(() => {
    setIsLoading(true)
    axiosInstance
      .get('/todos')
      .then((response) => {
        setTodos(response.data.todos)
        setIsLoading(false)
      })
      .catch((error) => {
        setError('Error fetching todos.')
        setIsLoading(false)
        console.error('Error fetching todos:', error)
      })
  }, [])

  const addTodo = (todo: Omit<TodoInterface, 'id'>) => {
    setIsLoading(true)
    axiosInstance
      .post('/todos', todo)
      .then((response) => {
        setTodos((prevTodos) => [...prevTodos, response.data.todo])
        setIsLoading(false)
      })
      .catch((error) => {
        setError('Error adding todo.')
        setIsLoading(false)
        console.error('Error adding todo:', error)
      })
  }

  const deleteTodo = (_id: number) => {
    setIsLoading(true)
    axiosInstance
      .delete(`/todos/${_id}`)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== _id))
        setIsLoading(false)
      })
      .catch((error) => {
        setError('Error deleting todo.')
        setIsLoading(false)
        console.error('Error deleting todo:', error)
      })
  }

  const toggleTodo = (_id: number) => {
    const todo = todos.find((todo) => todo._id === _id)
    if (!todo) return
    setIsLoading(true)
    axiosInstance
      .put(`/todos/${_id}`, { ...todo, completed: !todo.completed })
      .then((response) => {
        setTodos((prevTodos) => prevTodos.map((t) => (t._id === _id ? response.data.todo : t)))
        setIsLoading(false)
      })
      .catch((error) => {
        setError('Error toggling todo.')
        setIsLoading(false)
        console.error('Error toggling todo:', error)
      })
  }

  const deleteAllTodos = () => {
    setIsLoading(true)
    Promise.all(todos.map((todo) => axiosInstance.delete(`/todos/${todo._id}`)))
      .then(() => {
        setTodos([])
        setIsLoading(false)
      })
      .catch((error) => {
        setError('Error deleting all todos.')
        setIsLoading(false)
        console.error('Error deleting all todos:', error)
      })
  }

  const clearCompletedTodos = () => {
    setIsLoading(true)
    Promise.all(todos.filter((todo) => todo.completed).map((todo) => axiosInstance.delete(`/todos/${todo._id}`)))
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed))
        setIsLoading(false)
      })
      .catch((error) => {
        setError('Error clearing completed todos.')
        setIsLoading(false)
        console.error('Error clearing completed todos:', error)
      })
  }

  const completedTodosCount = todos.filter((todo) => todo.completed).length

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        deleteTodo,
        toggleTodo,
        deleteAllTodos,
        clearCompletedTodos,
        completedTodosCount,
        isLoading,
        error
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export default TodoProvider
