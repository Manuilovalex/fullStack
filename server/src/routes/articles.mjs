import { Router } from 'express'
import {
  getArticles,
  getArticle,
  createArticleOrArticles,
  deleteArticleOrArticles,
  updateArticleOrArticles,
  replaceArticle,
  getArticleStats
} from '../controllers/articles.mjs'
import { validateArticleData } from '../middlewares/validateArticle.mjs'
import { ensureAuthenticated } from '../middlewares/authMiddleware.mjs'
import { checkArticlesEmpty } from '../middlewares/checkArticlesEmpty.mjs'

const articlesRouter = Router()

articlesRouter
  .route('/')
  .get(ensureAuthenticated, checkArticlesEmpty, getArticles)
  .post(ensureAuthenticated, validateArticleData, createArticleOrArticles)
  .delete(ensureAuthenticated, deleteArticleOrArticles)
  .put(ensureAuthenticated, validateArticleData, updateArticleOrArticles)

articlesRouter.get('/stats', ensureAuthenticated, getArticleStats)

articlesRouter
  .route('/:id')
  .get(ensureAuthenticated, getArticle)
  .delete(ensureAuthenticated, deleteArticleOrArticles)
  .put(ensureAuthenticated, validateArticleData, updateArticleOrArticles)
  .patch(ensureAuthenticated, validateArticleData, replaceArticle)

export default articlesRouter
