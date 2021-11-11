import React, { useMemo } from 'react'

import classNames from 'classnames'
import { chunk } from 'lodash'

import { useAppSelector } from '@hooks'
import { generateUniqueIDs } from '@pages/feed/feed-status-info/feed-status-info.utils'

import {
  ordersTotalCountSelector,
  ordersTotalTodayCountSelector,
  selectOrdersByStatus,
} from '../feed-page.slice'

import FeedStatusInfoList from './feed-status-info-list/feed-status-info-list'

import styles from './feed-status-info.module.css'

const FeedStatusInfo = (): JSX.Element => {
  const ordersTotalCount = useAppSelector(ordersTotalCountSelector)
  const ordersTotalTodayCount = useAppSelector(ordersTotalTodayCountSelector)

  const doneOrders = useAppSelector((state) => selectOrdersByStatus(state)('done'))
  const doneOrdersChunks = useMemo(() => chunk(doneOrders, 10), [doneOrders])
  const doneOrdersChunkIDs = useMemo(
    () => generateUniqueIDs(doneOrdersChunks.length),
    [doneOrdersChunks.length],
  )

  const pendingOrders = useAppSelector((state) => selectOrdersByStatus(state)('pending'))
  const pendingOrdersChunks = useMemo(() => chunk(pendingOrders, 10), [pendingOrders])
  const pendingOrdersChunksIDs = useMemo(
    () => generateUniqueIDs(pendingOrdersChunks.length),
    [pendingOrdersChunks.length],
  )

  const orderNumberClass = useMemo(
    () => classNames('text text_type_digits-large', styles.orderNumber),
    [],
  )

  return (
    <div className={styles.wrapper}>
      <div className={styles.lists}>
        <div className={styles.list}>
          {/* NOTE: Could be improved by https://github.com/bvaughn/react-window */}
          {doneOrdersChunks.map((orderChunk, i) => (
            <FeedStatusInfoList key={doneOrdersChunkIDs[i]} orders={orderChunk} title='Готовы' />
          ))}
        </div>
        <div className={styles.list}>
          {/* NOTE: Could be improved by https://github.com/bvaughn/react-window */}
          {pendingOrdersChunks.map((orderChunk, i) => (
            <FeedStatusInfoList
              key={pendingOrdersChunksIDs[i]}
              orders={orderChunk}
              title='В работе'
            />
          ))}
        </div>
      </div>
      <div className={styles.infoSection}>
        <span className='text text_type_main-medium'>Выполнено за все время:</span>
        <span className={orderNumberClass}>{ordersTotalCount}</span>
      </div>
      <div className={styles.infoSection}>
        <span className='text text_type_main-medium'>Выполнено за сегодня:</span>
        <span className={orderNumberClass}>{ordersTotalTodayCount}</span>
      </div>
    </div>
  )
}

export default React.memo(FeedStatusInfo)
