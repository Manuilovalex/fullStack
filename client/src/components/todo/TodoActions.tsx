import Button from './Button.tsx'
import { RiCheckboxCircleLine, RiDeleteBin5Fill } from 'react-icons/ri'
import { useContext } from 'react'
import { TodoContext } from '../../context/TodoContext.ts'

const TodoActions = () => {
  const { deleteAllTodos, clearCompletedTodos, todos } = useContext(TodoContext)
  const completedTodosExist: boolean = todos.some((todo) => todo.completed)

  return (
    <div className="todos__actions">
      <Button title="Delete all Todos" onClick={() => deleteAllTodos()}>
        <RiDeleteBin5Fill />
      </Button>
      <Button title="Clear completed Todos" onClick={() => clearCompletedTodos()} disabled={!completedTodosExist}>
        <RiCheckboxCircleLine />
      </Button>
    </div>
  )
}

export default TodoActions
