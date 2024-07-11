import { useState, useEffect } from 'react'
import axios from 'axios'
import { TodoProviderPropsInterface } from '../../types/todo/TodoProviderProps.interface.ts'
import { TodoInterface } from '../../types/todo/Todo.interface.ts'
import { TodoContext } from '../../context/TodoContext.ts'

const TodoProvider = ({ children }: TodoProviderPropsInterface) => {
  const [todos, setTodos] = useState<TodoInterface[]>([])

  useEffect(() => {
    axios
      .get('http://localhost:3000/todos')
      .then((response) => setTodos(response.data.todos))
      .catch((error) => console.error('Error fetching todos:', error))
  }, [])

  const addTodo = (todo: Omit<TodoInterface, 'id'>) => {
    axios
      .post('http://localhost:3000/todos', todo)
      .then((response) => setTodos((prevTodos) => [...prevTodos, response.data.todo]))
      .catch((error) => console.error('Error adding todo:', error))
  }

  const deleteTodo = (_id: number) => {
    console.log(_id)
    axios
      .delete(`http://localhost:3000/todos/${_id}`)
      .then(() => setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== _id)))
      .catch((error) => console.error('Error deleting todo:', error))
  }

  const toggleTodo = (_id: number) => {
    const todo = todos.find((todo) => todo._id === _id)
    if (!todo) return
    axios
      .put(`http://localhost:3000/todos/${_id}`, { ...todo, completed: !todo.completed })
      .then((response) => setTodos((prevTodos) => prevTodos.map((t) => (t._id === _id ? response.data.todo : t))))
      .catch((error) => console.error('Error toggling todo:', error))
  }

  const deleteAllTodos = () => {
    Promise.all(todos.map((todo) => axios.delete(`http://localhost:3000/todos/${todo._id}`)))
      .then(() => setTodos([]))
      .catch((error) => console.error('Error deleting all todos:', error))
  }

  const clearCompletedTodos = () => {
    Promise.all(
      todos.filter((todo) => todo.completed).map((todo) => axios.delete(`http://localhost:3000/todos/${todo._id}`))
    )
      .then(() => setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed)))
      .catch((error) => console.error('Error clearing completed todos:', error))
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
        completedTodosCount
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export default TodoProvider
