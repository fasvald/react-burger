import { ReactNode } from 'react'

export interface IModalProps {
  children: ReactNode
  onClose?: () => void
}

export interface IModalRefObject {
  open: () => void
  close: () => void
}
