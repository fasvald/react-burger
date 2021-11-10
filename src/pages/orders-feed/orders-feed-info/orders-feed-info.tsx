import React, { useMemo } from 'react'

import classNames from 'classnames'
import { chunk } from 'lodash'
import { nanoid } from 'nanoid'

import { useAppSelector } from '@hooks'

import {
  ordersTotalCountSelector,
  ordersTotalTodayCountSelector,
  selectOrdersByStatus,
} from '../orders-feed-page.slice'

import OrdersFeedInfoList from './orders-feed-info-list/orders-feed-info-list'

import styles from './orders-feed-info.module.css'

const OrdersFeedInfo = (): JSX.Element => {
  const ordersWithDoneStatus = useAppSelector((state) => selectOrdersByStatus(state)('done'))
  const ordersWithPendingStatus = useAppSelector((state) => selectOrdersByStatus(state)('pending'))
  const ordersTotalCount = useAppSelector(ordersTotalCountSelector)
  const ordersTotalTodayCount = useAppSelector(ordersTotalTodayCountSelector)

  const ordersWithDoneStatusChunks = useMemo(
    () => chunk(ordersWithDoneStatus, 10),
    [ordersWithDoneStatus],
  )
  const ordersWithDoneStatusChunksIDs = useMemo(
    () => [...new Array(ordersWithDoneStatusChunks.length)].map(() => nanoid()),
    [ordersWithDoneStatusChunks.length],
  )

  const ordersWithPendingStatusChunks = useMemo(
    () => chunk(ordersWithPendingStatus, 10),
    [ordersWithPendingStatus],
  )
  const ordersWithPendingStatusChunksIDs = useMemo(
    () => [...new Array(ordersWithPendingStatusChunks.length)].map(() => nanoid()),
    [ordersWithPendingStatusChunks.length],
  )

  const orderNumberClass = useMemo(
    () => classNames('text text_type_digits-large', styles.orderNumber),
    [],
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.lists}>
        {/* NOTE: Could be improved by https://github.com/bvaughn/react-window */}
        <div className={styles.list}>
          {ordersWithDoneStatusChunks.map((orderChunk, i) => (
            <OrdersFeedInfoList
              key={ordersWithDoneStatusChunksIDs[i]}
              orders={orderChunk}
              title='Готовы'
            />
          ))}
        </div>
        <div className={styles.list}>
          {ordersWithPendingStatusChunks.map((orderChunk, i) => (
            <OrdersFeedInfoList
              key={ordersWithPendingStatusChunksIDs[i]}
              orders={orderChunk}
              title='В работе'
            />
          ))}
        </div>
      </div>
      <div className={styles.infoSection}>
        <p className='text text_type_main-medium'>Выполнено за все время:</p>
        <span className={orderNumberClass}>{ordersTotalCount}</span>
      </div>
      <div className={styles.infoSection}>
        <p className='text text_type_main-medium'>Выполнено за сегодня:</p>
        <span className={orderNumberClass}>{ordersTotalTodayCount}</span>
      </div>
    </div>
  )
}

export default React.memo(OrdersFeedInfo)
