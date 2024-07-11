import { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { TodoContext } from '../../context/TodoContext.ts'
import Button from './Button.tsx'

const Form = () => {
  const { addTodo } = useContext(TodoContext)
  const [title, setTitle] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    addTodo({
      userId: 1,
      _id: 1,
      title,
      completed: false
    })
    setTitle('')
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  return (
    <form className='formTodo' onSubmit={handleSubmit}>
      <input className="input" type="text" placeholder="Enter new todo..." value={title} onChange={handleInputChange} />
      <Button type="submit" title="Submit form" disabled={!title.trim()}>
        Save todo
      </Button>
    </form>
  )
}

export default Form
