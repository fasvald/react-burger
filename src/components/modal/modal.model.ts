import { ReactNode } from 'react'

export interface IModalProps {
  children: ReactNode
}

export interface IModalRefObject {
  open: () => void
  close: () => void
}
