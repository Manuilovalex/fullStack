import axios from 'axios'
import { ProductInterface } from '../types/Product.interface'
import { useState } from 'react'

const useAdd = (baseURL: string) => {
  const [error, setError] = useState<string | null>(null)

  const add = async (product: Partial<ProductInterface>) => {
    try {
      const response = await axios.post(baseURL, product, {
        withCredentials: true
      })
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message)
        console.error('Failed to add product:', error.response?.data || error.message)
      } else {
        setError((error as Error).message)
        console.error('An unexpected error occurred:', (error as Error).message)
      }
      throw error
    }
  }

  return { add, error }
}

export default useAdd
