import { Router } from 'express'
import { createTodo, getTodos, getTodo, updateTodo, deleteTodo } from '../controllers/todos.mjs'
import { ensureAuthenticated } from '../middlewares/authMiddleware.mjs'

const todosRouter = Router()

todosRouter.route('/').post(ensureAuthenticated, createTodo).get(ensureAuthenticated, getTodos)

todosRouter
  .route('/:id')
  .get(ensureAuthenticated, getTodo)
  .put(ensureAuthenticated, updateTodo)
  .delete(ensureAuthenticated, deleteTodo)

export default todosRouter
