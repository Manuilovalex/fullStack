export const API_URL = 'http://localhost:3000/products'

const PRODUCTS_PER_PAGE = 12

 export const createUrl = (page: number, name: string, sort: string, order: string) => {
    const url = new URL(API_URL)
    url.searchParams.append('page', page.toString())
    url.searchParams.append('limit', PRODUCTS_PER_PAGE.toString())
    if (name) url.searchParams.append('name', name)
    if (sort) url.searchParams.append('sort', sort)
    if (order) url.searchParams.append('order', order)
    return url.toString()
  }
