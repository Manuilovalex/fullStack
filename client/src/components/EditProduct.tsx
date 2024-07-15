import { ReactNode, useState } from 'react';
import { ProductInterface } from '../types/Product.interface';
import Modal from '../modal/Modal';
import ProductForm from './form/ProductForm';
import { API_URL } from '../utils/mockapi';
import { useUpdate } from '../hooks/useUpdate';

interface EditProductButtonPropsInterface {
  children: ReactNode;
  product: ProductInterface;
  reload: () => void;
}

const EditProduct = ({ children, product, reload }: EditProductButtonPropsInterface) => {
  const [showModal, setShowModal] = useState(false);
  const { update, error } = useUpdate(API_URL);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

const handleSubmit = async (updatedProduct: Partial<ProductInterface>) => {
  try {
    const mergedProduct = { ...product, ...updatedProduct }
    console.log(product)
    const updatedResult = await update(mergedProduct)
    console.log(updatedResult)
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
          <h2 className="modal__title">Edit product</h2>
          {error && <p className="error">{error}</p>}
          <ProductForm onSubmit={handleSubmit} product={product} />
        </Modal>
      )}
    </>
  );
};

export default EditProduct;