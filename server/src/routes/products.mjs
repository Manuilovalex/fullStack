import { Router } from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  replaceProduct
} from '../controllers/products.mjs'
import { ensureAuthenticated } from '../middlewares/authMiddleware.mjs'

const productsRouter = Router()

productsRouter
  .route('/')
  .get(ensureAuthenticated, getProducts)
  .post(ensureAuthenticated, createProduct)
  .put(ensureAuthenticated, updateProduct)

productsRouter
  .route('/:id')
  .get(ensureAuthenticated, getProduct)
  .delete(ensureAuthenticated, deleteProduct)
  .put(ensureAuthenticated, updateProduct)
  .patch(ensureAuthenticated, replaceProduct)

export default productsRouter
