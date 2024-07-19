import axios from 'axios'
import { useState } from 'react'

export const useDelete = (url: string) => {
  const [error, setError] = useState<string | null>(null)

  const del = async (id: string) => {
    try {
      console.log('Deleting product with id:', id)
      const response = await axios.delete(`${url}/${id}`, {
        withCredentials: true
      })
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(`Error: Deletion failed with status code ${error.response?.status} - ${error.message}`)
        console.error('Failed to delete product:', error.response?.data || error.message)
      } else {
        setError(`Error: Deletion failed with message ${(error as Error).message}`)
        console.error('An unexpected error occurred:', (error as Error).message)
      }
      throw error
    }
  }

  return { del, error }
}
