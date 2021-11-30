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
 *
 * UPD #1. Fully refactored and simplified this component based on various component libraries (React MUI).
 * */

import React, { ReactNode, SyntheticEvent, useCallback, useEffect, useMemo } from 'react'

import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import ReactDOM from 'react-dom'
import { useNavigate } from 'react-router-dom'

import {
  createInjectionElement,
  disableBrowserBodyScroll,
  enableBrowserBodyScroll,
} from './modal.utils'

import styles from './modal.module.css'

interface IModalProps {
  children: ReactNode
  open: boolean
  isModalRoute?: boolean
  onClose?: () => void
}

const modalRootEl = document.getElementById('modal-root')

const Modal = ({ children, open, isModalRoute, onClose }: IModalProps): JSX.Element | null => {
  // We shouldn't memo this calculation because it's related to DOM, so it's unnecessary for memo
  const wrapperEl = createInjectionElement(modalRootEl)

  const navigate = useNavigate()

  const handleClose = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      enableBrowserBodyScroll()
      onClose && onClose()
      isModalRoute && navigate(-1)
    },
    [onClose, navigate, isModalRoute],
  )

  const handleOverlayClick = useCallback(
    (e: SyntheticEvent) => {
      if (e.target === e.currentTarget) {
        handleClose(e)
      }
    },
    [handleClose],
  )

  const handleEscape = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        handleClose(e)
      }
    },
    [handleClose],
  )

  const CloseIconMemo = useMemo(() => <CloseIcon type='primary' />, [])

  useEffect(() => {
    /* NOTE: This code break React Virtual DOM checking and break the modal route render after page reloading */
    // This check is to prevent of creation multiple div's inside of modal
    // root if the page have multiple modal instances (same for creation and removal wrapper)
    // if (!modalRootEl?.childElementCount) {
    //   modalRootEl?.appendChild(wrapperEl)
    // }

    if (open) {
      modalRootEl?.appendChild(wrapperEl)
      disableBrowserBodyScroll()
    }

    document.addEventListener('keydown', handleEscape, false)

    return () => {
      modalRootEl?.replaceChildren()
      document.removeEventListener('keydown', handleEscape, false)

      enableBrowserBodyScroll()
    }
  }, [handleEscape, wrapperEl, open])

  return ReactDOM.createPortal(
    open ? (
      <div data-test='modal-dialog' className={styles.wrapper} role='dialog'>
        <div
          data-test='modal-dialog__backdrop'
          className={styles.backdrop}
          onClick={handleOverlayClick}
          aria-hidden='true'
        >
          <div data-test='modal-dialog__container' className={styles.container}>
            <div data-test='modal-dialog__container-body' className={styles.dialog}>
              <button
                data-test='modal-dialog__container-body-close-btn'
                type='button'
                onClick={handleClose}
                className={styles.closeBtn}
              >
                {CloseIconMemo}
              </button>
              {children}
            </div>
          </div>
        </div>
      </div>
    ) : null,
    wrapperEl,
  )
}

export default React.memo(Modal)
