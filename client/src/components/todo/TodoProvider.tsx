import { useState, useEffect } from 'react'
import { TodoProviderPropsInterface } from '../../types/todo/TodoProviderProps.interface.ts'
import { TodoInterface } from '../../types/todo/Todo.interface.ts'
import { TodoContext } from '../../context/TodoContext.ts'
import { MOCK_TODOS } from '../../data/mockData.ts'

const TodoProvider = ({ children }: TodoProviderPropsInterface) => {
  const [todos, setTodos] = useState<TodoInterface[]>(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : MOCK_TODOS
  })

  const [nextId, setNextId] = useState<number>(() => {
    const savedTodos = localStorage.getItem('todos')
    const todos: TodoInterface[] = savedTodos ? JSON.parse(savedTodos) : MOCK_TODOS
    return todos.length ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (todo: Omit<TodoInterface, 'id'>) => {
    const newTodo = { ...todo, id: nextId }
    setTodos((prevTodos) => [...prevTodos, newTodo])
    setNextId((prevNextId) => prevNextId + 1)
  }

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id).map((todo, index) => ({ ...todo, id: index + 1 }))
    setTodos(updatedTodos)
    setNextId(todos.length + 1)
  }

  const toggleTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteAllTodos = () => {
    setTodos([])
    setNextId(1)
  }

  const clearCompletedTodos = () => {
    const activeTodos = todos.filter((todo) => !todo.completed).map((todo, index) => ({ ...todo, id: index + 1 }))
    setTodos(activeTodos)
    setNextId(activeTodos.length + 1)
  }

  const completedTodosCount: number = todos.filter((todo) => todo.completed).length

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
