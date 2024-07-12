import { useState } from 'react'
import { ProductInterface } from '../types/Product.interface'

interface UseUpdateHook {
  update: (product: Partial<ProductInterface>) => Promise<Partial<ProductInterface>> // Принимает частичный объект ProductInterface
  error: string | null
}

export const useUpdate = (apiUrl: string): UseUpdateHook => {
  const [error, setError] = useState<string | null>(null)

  const update = async (product: Partial<ProductInterface>): Promise<Partial<ProductInterface>> => {
    try {
      if (!product._id) {
        throw new Error('Product _id is missing')
      }
      console.log(product)
      const response = await fetch(`${apiUrl}/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      return await response.json()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      }
      throw err
    }
  }

  return { update, error }
}
