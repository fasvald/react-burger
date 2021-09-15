import { ReactNode, RefObject } from 'react'

import { IModalRefObject } from '../modal.model'

export interface IModalDialogProps {
  children: ReactNode
  modal: RefObject<IModalRefObject>
}
