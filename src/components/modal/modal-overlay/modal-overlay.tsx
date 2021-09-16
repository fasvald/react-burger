import React, { useCallback } from 'react'

import { IModalOverlayProps } from './modal-overlay.model'

import styles from './modal-overlay.module.css'

const ModalOverlay = ({ modal }: IModalOverlayProps): JSX.Element => {
  const handleClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        modal.current?.close()
      }
    },
    [modal],
  )

  return <div className={styles.backdrop} onClick={handleClick} aria-hidden='true' />
}

export default React.memo(ModalOverlay)
