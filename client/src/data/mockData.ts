import { ProductInterface } from '../types/Product.interface.ts'

export interface ProductCategoriesInterface {
  value: string
  text: string
}

export const PRODUCT_CATEGORIES: ProductCategoriesInterface[] = [
  {
    value: 'Laptops',
    text: 'Laptops'
  },
  {
    value: 'Desktops and All-in-Ones',
    text: 'Desktops and All-in-Ones'
  },
  {
    value: 'Graphics Cards',
    text: 'Graphics Cards'
  },
  {
    value: 'Monitors',
    text: 'Monitors'
  },
  {
    value: 'Accessories and Peripherals',
    text: 'Accessories and Peripherals'
  }
]

export const INITIAL_PRODUCT: Partial<ProductInterface> = {
  name: 'Lenovo Legion 5 Gaming Laptop',
  description: 'Affordable gaming laptop with high performance',
  price: 1000.0,
  image: 'https://loremflickr.com/640/480/random',
  category: 'Laptops'
}

export interface SortByListInterface {
  value: string
  text: string
}

export const SORT_BY_LIST: SortByListInterface[] = [
  {
    value: '',
    text: 'Default order'
  },
  {
    value: 'price',
    text: 'Price'
  },
  {
    value: 'name',
    text: 'Name'
  },
  {
    value: 'category',
    text: 'Category'
  }
]

export interface OrderByListInterface {
  value: string
  text: string
}

export const ORDER_BY_LIST: OrderByListInterface[] = [
  {
    value: 'asc',
    text: 'Ascending'
  },
  {
    value: 'desc',
    text: 'Descending'
  }
]

export interface LinkInterface {
  path: string
  name: string
}

export const NAVBAR_LINKS: LinkInterface[] = [
  { path: '/', name: 'Home' },
  { path: '/products', name: 'Products' },
  { path: '/posts', name: 'Posts' },
  { path: '/users', name: 'Users' },
  { path: '/todos', name: 'Todos' }
]

export const MOCK_TODOS = [
  {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false
  },
  {
    userId: 1,
    id: 2,
    title: 'quis ut nam facilis et officia qui',
    completed: false
  }
]
