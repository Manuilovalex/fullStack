import { useContext } from 'react'
import Todo from './Todo.tsx'
import { TodoContext } from '../../context/TodoContext.ts'

const Todos = () => {
  const { todos, completedTodosCount } = useContext(TodoContext)

  return (
    <div className="todos">
      {!todos.length && <p className="todos__empty">Todos list is empty</p>}
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo} />
      ))}
      {completedTodosCount > 0 && (
        <p className="todos__message">
          You have completed {completedTodosCount} {completedTodosCount > 1 ? 'todos' : 'todo'}
        </p>
      )}
    </div>
  )
}

export default Todos
