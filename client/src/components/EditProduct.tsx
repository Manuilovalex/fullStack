import { ReactNode, useState } from 'react'
import { ProductInterface } from '../types/Product.interface.ts'
import Modal from '../modal/Modal.tsx'
import ProductForm from './form/ProductForm.tsx'
import { API_URL } from '../utils/mockapi.ts'
import { useUpdate } from '../hooks/useUpdate.ts'

interface EditProductButtonPropsInterface {
  children: ReactNode
  product: ProductInterface
  reload: () => void
}

const EditProduct = ({ children, product, reload }: EditProductButtonPropsInterface) => {
  const [showModal, setShowModal] = useState(false)
  const { update, error } = useUpdate(API_URL)

  const handleOpen = () => setShowModal(true)
  const handleClose = () => setShowModal(false)

  const handleSubmit = async (product: Partial<ProductInterface>) => {
    try {
      const updatedProduct = await update(product)
      console.log(updatedProduct)
      handleClose()
      reload()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <button className="product-item__delete" onClick={handleOpen}>
        {children}
      </button>

      {showModal && (
        <Modal onClose={handleClose}>
          <h2 className="modal__title">Add new product</h2>
          {error && <p className="error">{error}</p>}
          <ProductForm onSubmit={handleSubmit} product={product} />
        </Modal>
      )}
    </>
  )
}

export default EditProduct
