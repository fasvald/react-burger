import React, { useMemo } from 'react'

import classNames from 'classnames'

import { IOrder } from '@common/models/orders.model'

import styles from './feed-status-info-list.module.css'

interface IFeedStatusInfoListProps {
  className?: string
  title: string
  orders: IOrder[]
}

const FeedStatusInfoList = ({
  className,
  title,
  orders,
}: IFeedStatusInfoListProps): JSX.Element => {
  const wrapperClass = useMemo(() => classNames(className), [className])
  const titleClass = useMemo(() => classNames('text text_type_main-medium', styles.title), [])
  const listItemClass = useMemo(() => classNames('text text_type_digits-default', styles.title), [])

  return (
    <div className={wrapperClass}>
      <p className={titleClass}>{title}:</p>
      <ul className={styles.list}>
        {orders.map((order) => (
          <li className={listItemClass} key={order._id}>
            {order.number}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default React.memo(FeedStatusInfoList)
