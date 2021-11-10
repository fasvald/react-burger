import React, { useEffect, useMemo } from 'react'

import classNames from 'classnames'

import LoaderCircular from '@components/loader-circular/loader-circular'
import OrderCard from '@components/order-card/order-card'
import { useAppDispatch, useAppSelector } from '@hooks'

import OrdersFeedInfo from './orders-feed-info/orders-feed-info'
import { getOrders, ordersFeedSelector, ordersFeedStatusSelector } from './orders-feed-page.slice'

import styles from './orders-feed-page.module.css'

const OrdersFeedPage = (): JSX.Element => {
  const orders = useAppSelector(ordersFeedSelector)
  const ordersFeedStatus = useAppSelector(ordersFeedStatusSelector)

  const dispatch = useAppDispatch()

  const sectionTitleClass = useMemo(() => classNames('text text_type_main-large', styles.title), [])

  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])

  if (ordersFeedStatus === 'loading') {
    return <LoaderCircular />
  }

  if (ordersFeedStatus === 'error') {
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
      <section className={styles.sectionFeedOrders}>
        <h1 className={sectionTitleClass}>Лента заказов</h1>
        {/* NOTE: Could be improved with mixing https://github.com/bvaughn/react-window and img lazy loading */}
        <div className={styles.sectionFeedOrdersList}>
          {orders.map((order) => (
            <OrderCard className={styles.sectionFeedOrdersListItem} key={order._id} order={order} />
          ))}
        </div>
      </section>
      <section className={styles.sectionFeedInfo}>
        <OrdersFeedInfo />
      </section>
    </>
  )
}

export default React.memo(OrdersFeedPage)
