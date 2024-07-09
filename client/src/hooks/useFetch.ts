import { useEffect, useState } from 'react'
import axios from 'axios'

export const useFetch = <T>(url: string, limit?: number, reload?: string) => {
  const [data, setPosts] = useState<T[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log(url)

    const fetchPosts = async () => {
      try {
        const cancelTokenSource = axios.CancelToken.source()
        setIsLoading(true)
        setError(null)

        const response = await axios.get<T[]>(limit ? `${url}?_limit=${limit}` : url, {
          cancelToken: cancelTokenSource.token
        })

        if (response.status !== 200) {
          throw new Error(`Error: Request failed with status code ${response.status}`)
        }

        console.log('Response:', response.data)

        setPosts(response.data)
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', (error as Error).message)
        } else {
          setError(`Error fetching posts: ${(error as Error).message}`)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [url, limit, reload])

  return { data, isLoading, error }
}
