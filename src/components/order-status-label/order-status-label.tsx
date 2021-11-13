import React, { useMemo } from 'react'

import classNames from 'classnames'

import { IOrder, TOrderStatuses } from '@common/models/orders.model'

interface IOrderStatusLabel {
  className?: string
  order: IOrder
}

const ORDER_STATUSES: { [status in TOrderStatuses]: { text: string; color: string } } = {
  created: { text: 'Создан', color: '#fff' },
  pending: { text: 'Готовиться', color: '#fff' },
  done: { text: 'Выполнен', color: '#0cc' },
}

const OrderStatusLabel = ({ className, order }: IOrderStatusLabel): JSX.Element => {
  const statusClass = useMemo(
    () => classNames(className, 'text text_type_main-default'),
    [className],
  )

  return (
    <p
      className={statusClass}
      style={{
        color: ORDER_STATUSES[order.status].color,
      }}
    >
      {ORDER_STATUSES[order.status].text}
    </p>
  )
}

export default React.memo(OrderStatusLabel)
