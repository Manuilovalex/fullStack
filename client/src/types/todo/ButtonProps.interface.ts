import { ReactNode } from 'react'

export interface ButtonPropsInterface {
  children: ReactNode
  onClick: () => void
  title: string
  disabled: boolean
  type?: 'button' | 'submit' | 'reset'
}
