import { TodoContextInterface } from '../types/todo/TodoContext.interface.ts'

export const initialState: TodoContextInterface = {
  todos: [],
  addTodo: () => {},
  deleteTodo: () => {},
  toggleTodo: () => {},
  deleteAllTodos: () => {},
  clearCompletedTodos: () => {},
  completedTodosCount: 0,
  isLoading: false,
  error: null
}
