import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { debounce } from '../utils/debounce'
import { ProductInterface } from '../types/Product.interface'
import Product from '../components/Product'
import AddProduct from '../components/AddProduct'
import { MdRefresh } from 'react-icons/md'
import InputField from '../components/form/InputField'
import SelectField from '../components/form/SelectField'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../redux/store'
import {
  fetchAllProducts,
  selectProducts,
  selectProductsError,
  selectProductsLoading
} from '../redux/slices/productsSlice'
import { ORDER_BY_LIST, SORT_BY_LIST } from '../data/mockData'

const API_URL = 'http://localhost:3000'
const PRODUCTS_PER_PAGE = 9

const Products = () => {
  const [page, setPage] = useState(1)
  const [name, setName] = useState('')
  const [sort, setSort] = useState('')
  const [order, setOrder] = useState('asc')
  const [reload, setReload] = useState('0')
  const [inputValue, setInputValue] = useState('')

  const dispatch = useDispatch<AppDispatch>()
  const { products, totalPages } = useSelector(selectProducts)
  const isLoading = useSelector(selectProductsLoading)
  const error = useSelector(selectProductsError)

  useEffect(() => {
    dispatch(fetchAllProducts(createUrl(page, name, sort, order)))
  }, [dispatch, page, name, sort, order, reload])

  useEffect(() => {
    console.log('Products:', products)
  }, [products])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target
    setInputValue(value)
    debounceFilterProducts(value)
  }

  const debounceFilterProducts = useRef(
    debounce((value: string) => {
      setName(value)
    }, 1500)
  ).current

  const resetFilters = () => {
    setName('')
    setSort('')
    setOrder('asc')
    setInputValue('')
  }

  const createUrl = (page: number, name: string, sort: string, order: string) => {
    const url = new URL(`${API_URL}/products`)
    url.searchParams.append('page', page.toString())
    url.searchParams.append('limit', PRODUCTS_PER_PAGE.toString())
    if (name) url.searchParams.append('name', name)
    if (sort) url.searchParams.append('sort', sort)
    if (order) url.searchParams.append('order', order)
    return url.toString()
  }

  return (
    <div>
      <h1>Products list</h1>

      <div className="products-filter">
        <InputField
          id="filter"
          type="text"
          value={inputValue}
          placeholder="Filter products by name..."
          onChange={handleInputChange}
        />

        <SelectField id="sort" value={sort} onChange={(e) => setSort(e.target.value)} options={SORT_BY_LIST} />

        <SelectField id="order" value={order} onChange={(e) => setOrder(e.target.value)} options={ORDER_BY_LIST} />

        <button onClick={resetFilters}>
          <MdRefresh />
        </button>
      </div>

      {isLoading && <p className="loading">Loading...</p>}
      {error && <h2 className="error">{error}</h2>}

      {!isLoading && !error && Array.isArray(products) && (
        <div className="content">
          <div className="buttons-group">
            <AddProduct />
            <div className="pagination">
              <button
                className="pagination__btn"
                disabled={page === 1}
                onClick={() => setPage((prevState) => prevState - 1)}
              >
                Prev
              </button>
              <button
                className="pagination__btn"
                disabled={page === totalPages} // Использование totalPages
                onClick={() => setPage((prevState) => prevState + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <ul className="products-list">
            {products.map((product: ProductInterface) => (
              <Product key={product._id} product={product} reload={() => setReload(product._id)} />
            ))}
          </ul>

          <div className="pagination-arrows">
            <button
              className="pagination-arrow"
              disabled={page === 1}
              onClick={() => setPage((prevState) => prevState - 1)}
            >
              Prev
            </button>
            <button
              className="pagination-arrow"
              disabled={page === totalPages} // Использование totalPages
              onClick={() => setPage((prevState) => prevState + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
