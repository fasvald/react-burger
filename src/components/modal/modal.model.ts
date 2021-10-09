import { ReactNode } from 'react'

export interface IModalProps {
  children: ReactNode
  isModalRoute?: boolean
  onClose?: () => void
}

export interface IModalRefObject {
  open: () => void
  close: () => void
}
