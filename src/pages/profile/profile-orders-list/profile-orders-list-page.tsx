import React, { useCallback, useEffect } from 'react'

import Cookies from 'js-cookie'
import { useLocation, useNavigate } from 'react-router-dom'

import { WS_ENDPOINTS } from '@common/constants/api.constant'
import { IOrder } from '@common/models/orders.model'
import CardOrder from '@components/card/card-order/card-order'
import LoaderCircular from '@components/loader-circular/loader-circular'
import { saveOrderDetails } from '@components/modal/modal-order-details/modal-order-details.slice'
import { useAppDispatch, useAppSelector } from '@hooks'
import { authSelector } from '@services/slices/auth.slice'
import { getUsersOrders } from '@services/slices/orders.slice'
import { wsConnect, wsDisconnect } from '@services/slices/web-sockets.slice'

import {
  ordersSelector,
  ordersFetchStatusSelector,
  updateOrders,
} from './profile-orders-list-page.slice'

import styles from './profile-orders-list.module.css'

const ProfileOrdersListPage = (): JSX.Element => {
  const auth = useAppSelector(authSelector)
  const orders = useAppSelector(ordersSelector)
  const ordersFetchStatus = useAppSelector(ordersFetchStatusSelector)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = useCallback(
    (order: IOrder) => {
      dispatch(saveOrderDetails(order))

      navigate(`${order.number}`, {
        state: {
          isModal: true,
          background: location,
        },
      })
    },
    [location, navigate, dispatch],
  )

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getUsersOrders(!!auth.user))
      await dispatch(
        wsConnect({
          url: `${WS_ENDPOINTS.orders}?token=${Cookies.get('sb-authToken')}`,
          onMessageActionType: updateOrders.type,
        }),
      )
    }

    fetchData()

    return () => {
      dispatch(wsDisconnect())
    }
  }, [dispatch, auth.user])

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
        <div className={styles.feed}>
          {/* NOTE: Could be improved with mixing https://github.com/bvaughn/react-window and img lazy loading */}
          {orders.map((order) => (
            <CardOrder
              className={styles.feedItemCard}
              key={order._id}
              order={order}
              showStatus
              onClick={handleClick}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default React.memo(ProfileOrdersListPage)
