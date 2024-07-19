import { useEffect, useState } from 'react'
import axios, { CancelTokenSource } from 'axios'

export const useFetch = <T>(url: string, limit?: number, reload?: string) => {
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log(url)

    const fetchPosts = async () => {
      const cancelTokenSource: CancelTokenSource = axios.CancelToken.source()

      try {
        setIsLoading(true)
        setError(null)

        const response = await axios.get<T[]>(limit ? `${url}?_limit=${limit}` : url, {
          cancelToken: cancelTokenSource.token,
          withCredentials: true
        })

        if (response.status !== 200) {
          throw new Error(`Error: Request failed with status code ${response.status}`)
        }

        console.log('Response:', response.data)

        setData(response.data)
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', (error as Error).message)
        } else {
          setError(`Error fetching posts: ${(error as Error).message}`)
        }
      } finally {
        setIsLoading(false)
      }

      return () => {
        cancelTokenSource.cancel('Operation canceled by the user.')
      }
    }

    fetchPosts()
  }, [url, limit, reload])

  return { data, isLoading, error }
}
