import React, { useMemo } from 'react'

import classNames from 'classnames'

import orderAcceptedGif from '@assets/images/order-accepted.gif'

import { IOrderDetailsProps } from './modal-order-creation-details.model'

import styles from './modal-order-creation-details.module.css'

const ModalOrderCreationDetails = ({ orderDetails }: IOrderDetailsProps): JSX.Element => {
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
    <div data-test='modal-order-creation' className={styles.dialog}>
      <div className={styles.dialogBody}>
        <p data-test='modal-order-creation__number' className={orderNumberClass}>
          {order.number}
        </p>
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

export default React.memo(ModalOrderCreationDetails)
