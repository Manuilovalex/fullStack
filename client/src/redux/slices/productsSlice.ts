import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'
import { RootState } from '../store.ts'
import { ProductInterface } from '../../types/Product.interface.ts'

export interface ProductSliceInterface {
  products: ProductInterface[]
  error: string | null
  isLoading: boolean
}

const initialState: ProductSliceInterface = {
  products: [],
  error: null,
  isLoading: false
}

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (url: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<ProductInterface[]>(url)
      if (response.status !== 200) {
        throw new Error('Error fetching products')
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      return rejectWithValue(axiosError.message)
    }
  }
)

export const productsSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false
        if (action.payload instanceof Error) {
          state.error = action.payload.message
        } else {
          state.error = 'An error occurred'
        }
      })
  }
})

export const selectProducts = (state: RootState) => state.products.products
export const selectProductsLoading = (state: RootState) => state.products.isLoading
export const selectProductsError = (state: RootState) => state.products.error

export default productsSlice.reducer
