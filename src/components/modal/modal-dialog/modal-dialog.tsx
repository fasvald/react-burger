import React, { useCallback } from 'react'

import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components'

import { IModalDialogProps } from './modal-dialog.model'

import styles from './modal-dialog.module.css'

const ModalDialog = ({ children, modal }: IModalDialogProps): JSX.Element => {
  const handleClick = useCallback(() => {
    modal.current?.close()
  }, [modal])

  return (
    <div className={styles.container}>
      <div className={styles.dialog}>
        <button type='button' onClick={handleClick} className={styles.closeBtn}>
          <CloseIcon type='primary' />
        </button>
        {children}
      </div>
    </div>
  )
}

export default React.memo(ModalDialog)
