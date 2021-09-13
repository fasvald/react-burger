import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'

import ReactDOM from 'react-dom'

import { IModalProps } from './modal.model'

/**
 * NOTE: There are 2 main approaches how to render modals (from my experience at least):
 * 1. Inject in the specific div that is placed somewhere in body (already injected in index.html)
 * 2. Dynamically create the root div and append it to body
 * We are choosing the first option...
 * */

const modalRootEl = document.getElementById('modal-root')

// TODO: fix typings
const Modal = ({ children }: IModalProps, ref: any): JSX.Element | null => {
  const wrapperEl = document.createElement('div')

  const [isShown, setIsShown] = useState<boolean>(false)

  const open = useCallback(() => setIsShown(true), [])
  const close = useCallback(() => setIsShown(false), [])

  useImperativeHandle(ref, () => ({ open, close }), [open, close])

  useEffect(() => {
    modalRootEl?.appendChild(wrapperEl)

    return () => {
      modalRootEl?.removeChild(wrapperEl)
    }
  }, [wrapperEl])

  return ReactDOM.createPortal(
    isShown ? (
      <div>
        <button type='button' onClick={() => close()}>
          Close
        </button>
        {children}
      </div>
    ) : null,
    wrapperEl,
  )
}

// TODO: fix typings
export default forwardRef<any, IModalProps>(Modal)
