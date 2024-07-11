import { TodoPropsInterface } from '../../types/todo/TodoProps.interface.ts'
import { RiDeleteBinLine, RiTodoFill } from 'react-icons/ri'
import { FaCheck } from 'react-icons/fa6'
import { useContext } from 'react'
import { TodoContext } from '../../context/TodoContext.ts'

const Todo = ({ todo: { _id, userId, title, completed } }: TodoPropsInterface) => {
  const { deleteTodo, toggleTodo } = useContext(TodoContext)

  return (
    <div className={`todo${completed ? ' todo--completed' : ''}`}>
      <div className={'todo__userId'}>{userId}</div>
      <RiTodoFill className="todo__icon" />
      <h2 className="todo__title">{title}</h2>
      <div className="todo__completed">{completed.toString()}</div>
      <RiDeleteBinLine className="todo__delete-btn" onClick={() => deleteTodo(_id)} />
      <FaCheck className="todo__check-btn" onClick={() => toggleTodo(_id)} />
    </div>
  )
}

export default Todo
