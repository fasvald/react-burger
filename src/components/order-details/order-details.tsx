import React from 'react'

import classNames from 'classnames'

import orderAcceptedGif from '../../common/images/order-accepted.gif'

import { IOrderDetailsProps } from './order-details.model'

import styles from './order-details.module.css'

const OrderDetails = ({ orderDetails }: IOrderDetailsProps): JSX.Element => {
  const orderNumberClass = classNames('text text_type_digits-large', styles.orderNumber)
  const orderTitleClass = classNames('text text_type_main-medium', styles.orderNumberTitle)
  const orderDescriptionTitleClass = classNames('text text_type_main-default', styles.orderTitle)
  const orderDescriptionSubTitleClass = classNames(
    'text text_type_main-default text_color_inactive',
    styles.orderSubTitle,
  )

  const { order } = orderDetails

  return (
    <div className={styles.dialog}>
      <div className={styles.dialogBody}>
        <p className={orderNumberClass}>{order.number}</p>
        <p className={orderTitleClass}>идентификатор заказа</p>
        <img src={orderAcceptedGif} alt='Order Accepted' className={styles.orderAcceptedImg} />
        <p className={orderDescriptionTitleClass}>Ваш заказ начали готовить</p>
        <p className={orderDescriptionSubTitleClass}>Дождитесь готовности на орбитальной станции</p>
      </div>
    </div>
  )
}

export default React.memo(OrderDetails)
