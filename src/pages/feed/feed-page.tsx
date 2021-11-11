import React, { useEffect, useMemo } from 'react'

import classNames from 'classnames'

import CardOrder from '@components/cards/card-order/card-order'
import LoaderCircular from '@components/loader-circular/loader-circular'
import { useAppDispatch, useAppSelector } from '@hooks'

import { getOrders, ordersSelector, ordersFetchStatusSelector } from './feed-page.slice'
import FeedStatusInfo from './feed-status-info/feed-status-info'

import styles from './feed-page.module.css'

const FeedPage = (): JSX.Element => {
  const orders = useAppSelector(ordersSelector)
  const ordersFetchStatus = useAppSelector(ordersFetchStatusSelector)

  const dispatch = useAppDispatch()

  const titleClass = useMemo(() => classNames('text text_type_main-large', styles.title), [])

  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])

  if (ordersFetchStatus === 'loading') {
    return <LoaderCircular />
  }

  if (ordersFetchStatus === 'error') {
    return (
      <div className={styles.error}>
        <p className='text text_type_main-medium'>
          Заказы не смогли загрузиться. Повторите попытку.
        </p>
      </div>
    )
  }

  return (
    <>
      <section className={styles.sectionFeed}>
        <h1 className={titleClass}>Лента заказов</h1>
        <div className={styles.feed}>
          {/* NOTE: Could be improved with mixing https://github.com/bvaughn/react-window and img lazy loading */}
          {orders.map((order) => (
            <CardOrder className={styles.feedItemCard} key={order._id} order={order} />
          ))}
        </div>
      </section>
      <section className={styles.sectionInfo}>
        <FeedStatusInfo />
      </section>
    </>
  )
}

export default React.memo(FeedPage)
