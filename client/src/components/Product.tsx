import { ProductInterface } from '../types/Product.interface'
import { FaTrash } from 'react-icons/fa6'
import { FaEdit } from 'react-icons/fa'
import { AxiosError } from 'axios'
import { API_URL } from '../utils/mockapi'
import { useDelete } from '../hooks/useDelete'
import EditProduct from './EditProduct'

interface ProductPropsInterface {
  product: ProductInterface
  reload: () => Promise<void>
}

const Product = ({ product: { _id, name, description, category, price, image }, reload }: ProductPropsInterface) => {
  const { del: deleteProduct } = useDelete(API_URL)

  const defaultImage = 'https://via.placeholder.com/640x480'

  const imageUrl: string = image && image.startsWith('https') ? image : defaultImage

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(_id)
      await reload()
    } catch (error) {
      console.error((error as AxiosError).message)
    }
  }

  return (
    <li key={_id} className="product-item">
      <h2 className="product-item__title">{name}</h2>
      <p className="product-item__description">{description}</p>
      <p className="product-item__category">{category}</p>
      <p className="product-item__price">{price}</p>
      <img className="product-item__image" src={imageUrl} alt={name} />
      <div className="product-item__actions">
        <button className="product-item__delete" onClick={handleDeleteProduct}>
          <FaTrash />
        </button>
        <EditProduct product={{ _id, name, description, category, price, image }} reload={reload}>
          <FaEdit />
        </EditProduct>
      </div>
    </li>
  )
}

export default Product
