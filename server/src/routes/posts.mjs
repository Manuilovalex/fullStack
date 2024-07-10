import { Router } from 'express'
import {
  getPosts,
  getPost,
  createPostOrPosts,
  deletePostOrPosts,
  updatePostOrPosts,
  replacePost,
  getPostStats
} from '../controllers/posts.mjs'
import { validatePostData } from '../middlewares/validatePost.mjs'
import { ensureAuthenticated } from '../middlewares/authMiddleware.mjs'
import { checkPostsEmpty } from '../middlewares/checkPostsEmpty.mjs'

const postsRouter = Router()

postsRouter
  .route('/')
  .get(ensureAuthenticated, checkPostsEmpty, getPosts)
  .post(ensureAuthenticated, validatePostData, createPostOrPosts)
  .delete(ensureAuthenticated, deletePostOrPosts)
  .put(ensureAuthenticated, validatePostData, updatePostOrPosts)

postsRouter.get('/stats', ensureAuthenticated, getPostStats)

postsRouter
  .route('/:id')
  .get(ensureAuthenticated, getPost)
  .delete(ensureAuthenticated, deletePostOrPosts)
  .put(ensureAuthenticated, validatePostData, updatePostOrPosts)
  .patch(ensureAuthenticated, validatePostData, replacePost)

export default postsRouter
