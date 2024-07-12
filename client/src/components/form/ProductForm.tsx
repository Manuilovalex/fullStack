import { FormEvent, useState } from 'react'
import { ProductInterface } from '../../types/Product.interface.ts'
import { PRODUCT_CATEGORIES } from '../../data/mockData.ts'
import InputField from './InputField.tsx'
import SelectField from './SelectField.tsx'

interface ProductFormPropsInterface {
  onSubmit: (product: Partial<ProductInterface>) => void
  product: Partial<ProductInterface>
}

const ProductForm = ({ onSubmit, product }: ProductFormPropsInterface) => {
  const [name, setName] = useState(product.name as string)
  const [description, setDescription] = useState(product.description as string)
  const [price, setPrice] = useState(product.price as number)
  const [image, setImage] = useState(product.image as string)
  const [category, setCategory] = useState(product.category as string)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const returnedProduct: Partial<ProductInterface> = { name, description, price, image, category }

    if (product._id) {
      returnedProduct._id = product._id
    }

    onSubmit(returnedProduct)
    setName('')
    setDescription('')
    setPrice(0)
    setImage('')
    setCategory('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputField id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name..." />

      <InputField
        id="description"
        textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Product description..."
      />

      <InputField
        id="price"
        type="number"
        value={price}
        onChange={(e) => setPrice(+e.target.value)}
        placeholder="Price..."
      />

      <InputField
        id="image"
        type="url"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="image..."
      />

      <SelectField
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={PRODUCT_CATEGORIES}
      />

      <div className="form-group">
        <button className="form-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  )
}

export default ProductForm
