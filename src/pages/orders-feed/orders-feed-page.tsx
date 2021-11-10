import React, { useEffect, useMemo } from 'react'

import classNames from 'classnames'

import LoaderCircular from '@components/loader-circular/loader-circular'
import { useAppDispatch, useAppSelector } from '@hooks'

import OrdersFeedInfo from './orders-feed-info/orders-feed-info'
import { getOrders, ordersFeedStatusSelector } from './orders-feed-page.slice'

import styles from './orders-feed-page.module.css'

const OrdersFeedPage = (): JSX.Element => {
  const ordersFeedStatus = useAppSelector(ordersFeedStatusSelector)

  const dispatch = useAppDispatch()

  const sectionTitleClass = useMemo(() => classNames('text text_type_main-large', styles.title), [])

  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])

  if (ordersFeedStatus === 'loading') {
    return <LoaderCircular />
  }

  return (
    <>
      <section className={styles.sectionFeedOrders}>
        <h1 className={sectionTitleClass}>Лента заказов</h1>
        <div>Списки</div>
      </section>
      <section className={styles.sectionFeedInfo}>
        <OrdersFeedInfo />
      </section>
    </>
  )
}

export default React.memo(OrdersFeedPage)
