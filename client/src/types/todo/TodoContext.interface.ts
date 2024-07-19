import { TodoInterface } from './Todo.interface.ts'

export interface TodoContextInterface {
  todos: TodoInterface[]
  addTodo: (todo: Omit<TodoInterface, 'id'>) => void
  deleteTodo: (_id: number) => void
  toggleTodo: (_id: number) => void
  deleteAllTodos: () => void
  clearCompletedTodos: () => void
  completedTodosCount: number
  isLoading: boolean
  error: string | null
}
