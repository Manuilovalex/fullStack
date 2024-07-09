import TodoProvider from '../components/todo/TodoProvider.tsx'
import Form from '../components/todo/Form.tsx'
import TodoActions from '../components/todo/TodoActions.tsx'
import Todos from '../components/todo/Todos.tsx'

const TodosPages = () => {
  return (
    <TodoProvider>
      <div className="container">
        <h1>Todos Page</h1>
        <Form />
        <TodoActions />
        <Todos />
      </div>
    </TodoProvider>
  )
}

export default TodosPages
