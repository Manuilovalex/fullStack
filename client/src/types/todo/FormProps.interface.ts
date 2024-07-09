import { TodoInterface } from './Todo.interface.ts'

export interface FormPropsInterface {
  addTodo: (todo: TodoInterface) => void
}
