import { useState } from 'react'
import { ProductInterface } from '../types/Product.interface.ts'
import axios from 'axios'

export const useAdd = (url: string) => {
  const [error, setError] = useState<string | null>(null)

  const add = async (data: Partial<ProductInterface>) => {
    try {
      const response = await axios.post(url, data)
      return response.data
    } catch (error) {
      setError(`Error: The addition failed with the status code ${(error as Error).message}`)
    }
  }

  return { add, error }
}
