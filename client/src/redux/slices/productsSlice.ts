import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { ProductInterface } from '../../types/Product.interface'

export const fetchAllProducts = createAsyncThunk('products/fetchAll', async (url: string) => {
  const response = await axios.get(url)
  return response.data
})

interface ProductsState {
  products: ProductInterface[]
  totalPages: number
  totalProducts: number
  isLoading: boolean
  error: string | null
}

const initialState: ProductsState = {
  products: [],
  totalPages: 0,
  totalProducts: 0,
  isLoading: false,
  error: null
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.products = action.payload.products
      state.totalPages = action.payload.totalPages
      state.totalProducts = action.payload.totalProducts
      state.isLoading = false
    })
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || 'Failed to fetch products'
    })
  }
})

export const selectProducts = (state: { products: ProductsState }) => state.products

export const selectProductsLoading = (state: { products: ProductsState }) => state.products.isLoading

export const selectProductsError = (state: { products: ProductsState }) => state.products.error

export default productsSlice.reducer
