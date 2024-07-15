import { Product } from '../models/product.mjs'

export const createProduct = async (req, res, next) => {
  try {
    let products = req.body

    if (!Array.isArray(products)) {
      products = [products]
    }

    const result = await Product.insertMany(products)

    res.status(201).json({ message: 'Products created', ids: result.map((product) => product._id.toString()) })
  } catch (error) {
    next(error)
  }
}

export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 12
    const skip = (page - 1) * pageSize
    const name = req.query.name || ''
    const sortField = req.query.sort || 'name'
    const sortOrder = req.query.order === 'desc' ? -1 : 1

    const query = name ? { name: { $regex: name, $options: 'i' } } : {}

    const sortOptions = {}
    sortOptions[sortField] = sortOrder

    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(pageSize)

    const totalProducts = await Product.countDocuments(query)
    const totalPages = Math.ceil(totalProducts / pageSize)

    res.status(200).json({ products, page, pageSize, totalPages, totalProducts })
  } catch (error) {
    next(error)
  }
}

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json(product)
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id)

    if (!result) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ message: `Product with id ${req.params.id} deleted` })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const result = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!result) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ message: `Product with id ${req.params.id} updated` })
  } catch (error) {
    next(error)
  }
}

export const replaceProduct = async (req, res, next) => {
  try {
    const result = await Product.findOneAndReplace({ _id: req.params.id }, req.body, { new: true })

    if (!result) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ message: `Product with id ${req.params.id} replaced` })
  } catch (error) {
    next(error)
  }
}
