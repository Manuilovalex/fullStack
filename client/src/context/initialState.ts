import { TodoContextInterface } from "../types/todo/TodoContext.interface";

export const initialState: TodoContextInterface = {
  todos: [],
  addTodo: () => {},
  deleteTodo: () => {},
  toggleTodo: () => {},
  deleteAllTodos: () => {},
  clearCompletedTodos: () => {},
  completedTodosCount: 0
}
