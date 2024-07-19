import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ProductInterface } from '../../types/Product.interface'
import { RootState } from '../store'
import axiosInstance from '../../utils/axiosInstance'

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ page, name, sort, order }: { page: number; name: string; sort: string; order: string }) => {
    const response = await axiosInstance.get('/products', {
      params: {
        page,
        name,
        sort,
        order
      }
    })
    return response.data
  }
)

export const updateProduct = createAsyncThunk('products/updateProduct', async (product: Partial<ProductInterface>) => {
  const response = await axiosInstance.put(`/products/${product._id}`, product)
  return response.data
})

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: string) => {
  await axiosInstance.delete(`/products/${id}`)
  return id
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
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product._id === action.payload._id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product._id !== action.payload)
      })
  }
})

export const selectProducts = (state: RootState) => state.products

export const selectProductsLoading = (state: RootState) => state.products.isLoading

export const selectProductsError = (state: RootState) => state.products.error

export default productsSlice.reducer
