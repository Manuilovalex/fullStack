import { useState } from 'react'
import { ProductInterface } from '../types/Product.interface'

interface UseUpdateHook {
  update: (product: Partial<ProductInterface>) => Promise<void>
  error: string | null
}

export const useUpdate = (apiUrl: string): UseUpdateHook => {
  const [error, setError] = useState<string | null>(null)

  const update = async (product: Partial<ProductInterface>): Promise<void> => {
    try {
      if (!product._id) {
        throw new Error('Product _id is missing')
      }
      const response = await fetch(`${apiUrl}/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(product)
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      }
      throw err
    }
  }

  return { update, error }
}