import { ChangeEvent, forwardRef } from 'react'

interface InputFieldPropsInterface {
  id: string
  type?: string
  value: string | number
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string
  required?: boolean
  textarea?: boolean
}

const InputField = forwardRef<HTMLInputElement, InputFieldPropsInterface>(
  ({ id, value, type, onChange, placeholder, required = true, textarea = false }, ref) => {
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={id}>
          {id[0].toUpperCase() + id.slice(1)}
        </label>
        {textarea ? (
          <textarea
            className="form-control"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
          />
        ) : (
          <input
            ref={ref}
            className="form-control"
            id={id}
            value={value}
            type={type}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
          />
        )}
      </div>
    )
  }
)

export default InputField
