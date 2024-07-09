import { useState } from 'react'
import { ProductInterface } from '../types/Product.interface.ts'
import axios from 'axios'

export const useUpdate = (url: string) => {
  const [error, setError] = useState<string | null>(null)

  const update = async (data: Partial<ProductInterface>) => {
    console.log(data)
    try {
      const response = await axios.put(`${url}/${data.id}`, data)
      return response.data
    } catch (error) {
      setError(`Error: Update failed with status code ${(error as Error).message}`)
    }
  }

  return { update, error }
}
