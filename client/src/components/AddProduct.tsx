import { useState } from 'react'
import Modal from '../modal/Modal'
import ProductForm from './form/ProductForm'
import { ProductInterface } from '../types/Product.interface'
import useAdd from '../hooks/useAdd'
import { API_URL } from '../utils/mockapi'
import { INITIAL_PRODUCT } from '../data/mockData'

const AddProduct = () => {
  const [showModal, setShowModal] = useState(false)
  const { add: addProduct, error } = useAdd(API_URL)

  const handleOpen = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  const handleSubmit = async (product: Partial<ProductInterface>) => {
    try {
      const newProduct = await addProduct(product)
      console.log(newProduct)
      handleClose()
    } catch (error) {
      console.error('Failed to add product:', error)
    }
  }

  return (
    <>
      <button className="add-product-btn" onClick={handleOpen}>
        Add product
      </button>

      {showModal && (
        <Modal onClose={handleClose}>
          <h2 className="modal__title">Add new product</h2>
          {error && <p className="error">{error}</p>}
          <ProductForm onSubmit={handleSubmit} product={INITIAL_PRODUCT} />
        </Modal>
      )}
    </>
  )
}

export default AddProduct
