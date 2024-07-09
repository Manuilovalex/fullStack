import { createPortal } from 'react-dom'
import { MouseEvent as ReactMouseEvent, ReactNode } from 'react'

const modalRoot = document.getElementById('modal-root')

interface ModalPropsInterface {
  children: ReactNode
  onClose: () => void
}

const Modal = ({ children, onClose }: ModalPropsInterface) => {
  if (!modalRoot) return null

  let mouseDownTarget: EventTarget | null = null

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    mouseDownTarget = event.target
  }

  const handleMouseUp = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === mouseDownTarget && event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleContentClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return createPortal(
    <div className="modal-overlay" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div className="modal" onClick={handleContentClick}>
        <span className="modal__close" onClick={onClose}>
          x
        </span>
        {children}
      </div>
    </div>,
    modalRoot as HTMLElement
  )
}

export default Modal
