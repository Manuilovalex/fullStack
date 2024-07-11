import { Router } from 'express';
import {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todos.mjs';

const todosRouter = Router();

todosRouter.route('/')
  .post(createTodo)
  .get(getTodos);

todosRouter.route('/:id')
  .get(getTodo)
  .put(updateTodo)
  .delete(deleteTodo);

export default todosRouter;