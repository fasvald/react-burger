import React, { useCallback, useEffect } from 'react'

import { IModalOverlayProps } from './modal-overlay.model'

import styles from './modal-overlay.module.css'

const ModalOverlay = ({ modal }: IModalOverlayProps): JSX.Element => {
  const handleEscape = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        modal.current?.close()
      }
    },
    [modal],
  )

  const handleClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        modal.current?.close()
      }
    },
    [modal],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape, false)

    return () => {
      document.removeEventListener('keydown', handleEscape, false)
    }
  }, [handleEscape])

  return <div className={styles.backdrop} onClick={handleClick} aria-hidden='true' />
}

export default ModalOverlay
