import React, { useEffect, useMemo } from 'react'

import classNames from 'classnames'
import { useParams } from 'react-router-dom'

import { ingredientsSelector } from '@components/burger-ingredients/burger-ingredients.slice'
import { useAppDispatch, useAppSelector } from '@hooks'
import { authSelector } from '@services/slices/auth.slice'
import { getOrderByNumber } from '@services/slices/orders.slice'

import { selectChosenOrder } from './modal-order-details.slice'

import styles from './modal-order-details.module.css'

interface IOrderDetailsStatusProps {
  isFullSizePage?: boolean
}

const ModalOrderDetails = ({ isFullSizePage }: IOrderDetailsStatusProps): JSX.Element => {
  const { orderNumber } = useParams()

  const auth = useAppSelector(authSelector)
  const ingredients = useAppSelector(ingredientsSelector)
  const order = useAppSelector((state) =>
    selectChosenOrder(state)(parseInt(orderNumber as string, 10), !!auth.user),
  )

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!order) {
      dispatch(
        getOrderByNumber({
          orderNumber: parseInt(orderNumber as string, 10),
          isPrivate: !!auth.user,
        }),
      )
    }
  }, [auth.user, dispatch, orderNumber, order])

  const dialogWrapperClass = useMemo(
    () => classNames(styles.dialog, isFullSizePage ? styles.dialog_fullSize : ''),
    [isFullSizePage],
  )

  if (order) {
    return (
      <div className={dialogWrapperClass}>
        <div className={styles.dialogHeader}>ORDER NUMBER: {order.number}</div>
        <div className={styles.dialogBody}>
          <p>{order.name}</p>
          {order.ingredients.map((ingredient, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={ingredient + i}>{ingredient}</p>
          ))}
          <p>{order.createdAt}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={dialogWrapperClass}>
      <div className={styles.dialogHeader}>ORDER NUMBER</div>
      <div className={styles.dialogBody}>ORDER BODY</div>
    </div>
  )
}

export default React.memo(ModalOrderDetails)
