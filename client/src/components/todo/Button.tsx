import { ButtonPropsInterface } from "../../types/todo/ButtonProps.interface"

const Button = ({ children, ...props }: Partial<ButtonPropsInterface>) => {
  return <button {...props}>{children}</button>
}

export default Button
