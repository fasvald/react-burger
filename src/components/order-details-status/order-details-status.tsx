import React, { useMemo } from 'react'

import classNames from 'classnames'
import { useParams } from 'react-router-dom'

import styles from './order-details-status.module.css'

interface IOrderDetailsStatusProps {
  isFullSizePage?: boolean
}

const OrderDetailsStatus = ({ isFullSizePage }: IOrderDetailsStatusProps): JSX.Element => {
  const { id } = useParams()

  const dialogWrapperClass = useMemo(
    () => classNames(styles.dialog, isFullSizePage ? styles.dialog_fullSize : ''),
    [isFullSizePage],
  )

  return (
    <div className={dialogWrapperClass}>
      <div className={styles.dialogHeader}>ORDER NUMBER</div>
      <div className={styles.dialogBody}>ORDER BODY</div>
    </div>
  )
}

export default React.memo(OrderDetailsStatus)
