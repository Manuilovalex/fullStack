import { TodoInterface } from './Todo.interface.ts'

export interface TodoContextInterface {
  todos: TodoInterface[]
  addTodo: (todo: TodoInterface) => void
  deleteTodo: (id: number) => void
  deleteAllTodos: () => void
  clearCompletedTodos: () => void
  toggleTodo: (id: number) => void
  completedTodosCount: number
}
