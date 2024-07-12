export const API_URL = 'http://localhost:3000/products' // Обновите на ваш локальный сервер
export const API_ITEMS_PER_PAGE_LIMIT = 12

export function createUrl(page: number | string, name: string, sort: string, order: string): string {
  const urlObject = new URL(API_URL)
  urlObject.searchParams.set('page', `${page}`)
  urlObject.searchParams.set('limit', `${API_ITEMS_PER_PAGE_LIMIT}`)
  name && urlObject.searchParams.set('name', `${name}`)
  sort && urlObject.searchParams.set('sortBy', `${sort}`)
  order && urlObject.searchParams.set('order', `${order}`)
  return urlObject.toString()
}
