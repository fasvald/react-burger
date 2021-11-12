import React, { useMemo } from 'react'

import classNames from 'classnames'

import orderAcceptedGif from '@assets/images/order-accepted.gif'

import { IOrderDetailsProps } from './order-details.model'

import styles from './order-details.module.css'

const OrderDetails = ({ orderDetails }: IOrderDetailsProps): JSX.Element => {
  const { order } = orderDetails

  const orderNumberClass = useMemo(
    () => classNames('text text_type_digits-large', styles.orderNumber),
    [],
  )

  const orderTitleClass = useMemo(
    () => classNames('text text_type_main-medium', styles.orderNumberTitle),
    [],
  )

  const orderDescriptionTitleClass = useMemo(
    () => classNames('text text_type_main-default', styles.orderTitle),
    [],
  )

  const orderDescriptionSubTitleClass = useMemo(
    () => classNames('text text_type_main-default text_color_inactive', styles.orderSubTitle),
    [],
  )

  return (
    <div className={styles.dialog}>
      <div className={styles.dialogBody}>
        <p className={orderNumberClass}>{order.number}</p>
        <p className={orderTitleClass}>идентификатор заказа</p>
        <img src={orderAcceptedGif} alt='Order Accepted' className={styles.orderAcceptedImg} />
        <p className={orderDescriptionTitleClass}>Ваш заказ готов</p>
        <p className={orderDescriptionSubTitleClass}>
          Можете забрать заказ на орбитальной станции или посмотреть список заказов
        </p>
      </div>
    </div>
  )
}

export default React.memo(OrderDetails)
