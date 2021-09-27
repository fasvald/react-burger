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

import React, {
  forwardRef,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'

import ReactDOM from 'react-dom'

import ModalDialog from './modal-dialog/modal-dialog'
import ModalOverlay from './modal-overlay/modal-overlay'
import { IModalProps, IModalRefObject } from './modal.model'
import { blockBrowserScroll, createInjectionElement, unblockBrowserScroll } from './modal.utils'

import styles from './modal.module.css'

const modalRootEl = document.getElementById('modal-root')

const Modal = (
  { children, onClose }: IModalProps,
  ref: Ref<IModalRefObject>,
): JSX.Element | null => {
  // We shouldn't memo this calculation because it's related to DOM, so it's unnecessary for memo
  const wrapperEl = createInjectionElement(modalRootEl)

  const [isShown, setIsShown] = useState<boolean>(false)

  const open = useCallback(() => {
    setIsShown(true)
    blockBrowserScroll()
  }, [])

  const close = useCallback(() => {
    setIsShown(false)
    unblockBrowserScroll()

    if (onClose) {
      onClose()
    }
  }, [onClose])

  const handleEscape = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        close()
      }
    },
    [close],
  )

  useImperativeHandle(ref, () => ({ open, close }), [open, close])

  useEffect(() => {
    // This check is to prevent of creation multiple div's inside of modal
    // root if the page have multiple modal instances (same for creation and removal wrapper)
    if (!modalRootEl?.childElementCount) {
      modalRootEl?.appendChild(wrapperEl)
    }

    document.addEventListener('keydown', handleEscape, false)

    return () => {
      modalRootEl?.replaceChildren()

      document.removeEventListener('keydown', handleEscape, false)
    }
  }, [wrapperEl, handleEscape])

  return ReactDOM.createPortal(
    isShown ? (
      <div className={styles.wrapper} role='dialog'>
        <ModalOverlay modal={ref as RefObject<IModalRefObject>} />
        <ModalDialog modal={ref as RefObject<IModalRefObject>}>{children}</ModalDialog>
      </div>
    ) : null,
    wrapperEl,
  )
}

export default React.memo(forwardRef<IModalRefObject, IModalProps>(Modal))
