import { Todo } from '../models/todo.mjs'

export const createTodo = async (req, res, next) => {
  try {
    const maxUserIdTodo = await Todo.findOne().sort('-userId').exec()
    const newUserId = maxUserIdTodo ? maxUserIdTodo.userId + 1 : 1

    const todo = new Todo({
      userId: newUserId,
      title: req.body.title,
      completed: req.body.completed
    })

    const result = await todo.save()

    res.status(201).json({ message: 'Todo created', todo: result })
  } catch (error) {
    next(error)
  }
}

export const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({})
    res.status(200).json({ todos })
  } catch (error) {
    next(error)
  }
}

export const getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id)
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }
    res.status(200).json(todo)
  } catch (error) {
    next(error)
  }
}

export const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }
    res.status(200).json({ message: 'Todo updated', todo })
  } catch (error) {
    next(error)
  }
}

export const deleteTodo = async (req, res, next) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id)
    if (!result) {
      return res.status(404).json({ message: 'Todo not found' })
    }
    res.status(200).json({ message: 'Todo deleted' })
  } catch (error) {
    next(error)
  }
}
