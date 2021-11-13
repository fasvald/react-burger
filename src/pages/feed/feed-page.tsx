import React, { useCallback, useEffect, useMemo } from 'react'

import classNames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'

import { WS_ENDPOINTS } from '@common/constants/api.constant'
import { IOrder } from '@common/models/orders.model'
import CardOrder from '@components/card/card-order/card-order'
import LoaderCircular from '@components/loader-circular/loader-circular'
import { saveOrderDetails } from '@components/modal/modal-order-details/modal-order-details.slice'
import { useAppDispatch, useAppSelector } from '@hooks'
import { getAllOrders } from '@services/slices/orders.slice'
import { wsConnect, wsDisconnect } from '@services/slices/web-sockets.slice'

import { ordersSelector, ordersFetchStatusSelector, updateOrders } from './feed-page.slice'
import FeedStatusInfo from './feed-status-info/feed-status-info'

import styles from './feed-page.module.css'

const FeedPage = (): JSX.Element => {
  const orders = useAppSelector(ordersSelector)
  const ordersFetchStatus = useAppSelector(ordersFetchStatusSelector)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = useCallback(
    (order: IOrder) => {
      dispatch(saveOrderDetails(order))

      navigate(`/feed/${order.number}`, {
        state: {
          isModal: true,
          background: location,
        },
      })
    },
    [location, navigate, dispatch],
  )

  const titleClass = useMemo(() => classNames('text text_type_main-large', styles.title), [])

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllOrders())
      await dispatch(
        wsConnect({ url: WS_ENDPOINTS.ordersAll, onMessageActionType: updateOrders.type }),
      )
    }

    fetchData()

    return () => {
      dispatch(wsDisconnect())
    }
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
            <CardOrder
              className={styles.feedItemCard}
              key={order._id}
              order={order}
              onClick={handleClick}
            />
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
