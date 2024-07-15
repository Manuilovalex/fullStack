import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { ProductInterface } from '../../types/Product.interface'
import { RootState } from '../store'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
})

export const fetchAllProducts = createAsyncThunk('products/fetchAll', async () => {
  const response = await axiosInstance.get('/products')
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
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.products = action.payload.products
        state.totalPages = action.payload.totalPages
        state.totalProducts = action.payload.totalProducts
        state.isLoading = false
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch products'
      })
  }
})

export const selectProducts = (state: RootState) => state.products

export const selectProductsLoading = (state: RootState) => state.products.isLoading

export const selectProductsError = (state: RootState) => state.products.error

export default productsSlice.reducer
