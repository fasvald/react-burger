import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'

import ReactDOM from 'react-dom'

import ModalOverlay from './modal-overlay/modal-overlay'
import { IModalProps } from './modal.model'

import styles from './modal.module.css'

/**
 * NOTE: There are 2 main approaches to how to render modals (from my experience at least):
 *
 * 1. Inject in the specific div that is placed somewhere in the body (already injected in index.html).
 * 2. Dynamically create the root div and append it to the body.
 *
 * ---
 *
 * I am choosing the first option... and there are couple of reasons why:
 *
 * 1. It's much easier rather than dynamically create and save somewhere the root div. Yes we can
 * use class components here, but in the tasks and to challenge me I've decided to use functional
 * components.
 *
 * 2. To make everything dynamic it requires (as I understand it correctly) use custom hooks.
 * Here is a good example => https://www.jayfreestone.com/writing/react-portals-with-hooks/,
 * but anyway it is good info to know.
 *
 * 3. Basically, the best way and the most efficient is in the official React doc
 * (https://reactjs.org/docs/portals.html).
 *
 * 4. Also, I like how modals are working in Angular Material UI lib in a way of exposing API to
 * outside of the component, so I've found a very neat API in React => useImperativeHandle and
 * I've used it :).
 * */

const modalRootEl = document.getElementById('modal-root')

// TODO: fix typings
const Modal = ({ children }: IModalProps, ref: any): JSX.Element | null => {
  const wrapperEl = document.createElement('div')

  const [isShown, setIsShown] = useState<boolean>(false)

  const open = useCallback(() => {
    setIsShown(true)
    document.body.classList.add('modal-is-opened')
  }, [])

  const close = useCallback(() => {
    setIsShown(false)
    document.body.classList.remove('modal-is-opened')
  }, [])

  useImperativeHandle(ref, () => ({ open, close }), [open, close])

  useEffect(() => {
    modalRootEl?.appendChild(wrapperEl)

    return () => {
      modalRootEl?.removeChild(wrapperEl)
    }
  }, [wrapperEl])

  return ReactDOM.createPortal(
    isShown ? (
      <div className={styles.wrapper} role='dialog'>
        <ModalOverlay modal={ref} />
        <div className={styles.modal}>{children}</div>
      </div>
    ) : null,
    wrapperEl,
  )
}

// TODO: fix typings
export default forwardRef<any, IModalProps>(Modal)
