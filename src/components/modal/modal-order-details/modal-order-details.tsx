import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Skeleton } from '@mui/material'
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { useParams } from 'react-router-dom'

import { IBurgerIngredientCount } from '@components/burger-ingredients/burger-ingredients.model'
import { ingredientsSelector } from '@components/burger-ingredients/burger-ingredients.slice'
import DateFormattedLabel from '@components/date-formatted-label/date-formatted-label'
import IngredientAvatar from '@components/ingredient-avatar/ingredient-avatar'
import OrderStatusLabel from '@components/order-status-label/order-status-label'
import { useAppDispatch, useAppSelector } from '@hooks'
import { generateUniqueIDs } from '@pages/feed/feed-status-info/feed-status-info.utils'
import { authSelector } from '@services/slices/auth.slice'
import { getOrderByNumber } from '@services/slices/orders.slice'

import {
  orderByNumberFetchingSelector,
  removeOrderDetails,
  selectChosenOrder,
} from './modal-order-details.slice'
import { getUniqueIngredientsForOrder } from './modal-order-details.utils'

import styles from './modal-order-details.module.css'

interface IOrderDetailsStatusProps {
  isFullSizePage?: boolean
}

const SKELETON_ORDERS_MOCK = generateUniqueIDs(4)

const ModalOrderDetails = ({ isFullSizePage }: IOrderDetailsStatusProps): JSX.Element => {
  const { orderNumber } = useParams()

  const [ingredientsList, setIngredientsList] = useState<IBurgerIngredientCount[]>([])
  const [totalPrice, setTotalPrice] = useState<number>()

  const auth = useAppSelector(authSelector)
  const ingredients = useAppSelector(ingredientsSelector)
  const order = useAppSelector((state) =>
    selectChosenOrder(state)(parseInt(orderNumber as string, 10), !!auth.user),
  )
  const orderFetchStatus = useAppSelector(orderByNumberFetchingSelector)

  const dispatch = useAppDispatch()

  const calculateTotalPrice = useCallback((items: IBurgerIngredientCount[]) => {
    return items.reduce((sum, ingredient) => sum + ingredient.price * ingredient.count, 0)
  }, [])

  useEffect(() => {
    if (!order) {
      dispatch(
        getOrderByNumber({
          orderNumber: parseInt(orderNumber as string, 10),
          isPrivate: !!auth.user,
        }),
      )
    } else {
      const ingredientsInOrder = getUniqueIngredientsForOrder(ingredients, order.ingredients)
      setIngredientsList(ingredientsInOrder)
      setTotalPrice(calculateTotalPrice(ingredientsInOrder))
    }
  }, [dispatch, calculateTotalPrice, auth.user, orderNumber, order, ingredients])

  useEffect(() => {
    return () => {
      dispatch(removeOrderDetails())
    }
  }, [dispatch])

  const dialogWrapperClass = useMemo(
    () => classNames(styles.dialog, isFullSizePage ? styles.dialog_fullSize : ''),
    [isFullSizePage],
  )

  const orderPriceValueClass = useMemo(
    () => classNames('text text_type_digits-default', styles.orderIngredientPriceValue),
    [],
  )

  const CurrencyIconMemo = useMemo(() => <CurrencyIcon type='primary' />, [])

  if (!order) {
    return (
      <div className={dialogWrapperClass}>
        <div className={styles.dialogHeader}>
          <p className='text text_type_digits-default'>#{orderNumber}</p>
        </div>
        <div className={styles.dialogBody}>
          {orderFetchStatus === 'loading' && (
            <Skeleton
              variant='text'
              width='100%'
              height={60}
              sx={{ bgcolor: '#8585ad', marginBottom: '12px' }}
            />
          )}
          {orderFetchStatus === 'error' && (
            <p className={`text text_type_main-medium ${styles.orderName}`}>
              Заказ с таким номером #{orderNumber} не был найден на орбитальной станции. Повторите
              попытку.
            </p>
          )}
          <Skeleton
            variant='text'
            width='100%'
            height={24}
            sx={{ bgcolor: '#8585ad', marginBottom: '60px' }}
          />
          {SKELETON_ORDERS_MOCK.map((mock) => (
            <div
              key={mock}
              style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '16px' }}
            >
              <Skeleton
                variant='circular'
                width={64}
                height={64}
                sx={{ bgcolor: '#8585ad', flexShrink: 0 }}
              />
              <Skeleton
                variant='text'
                width='100%'
                height={24}
                sx={{ bgcolor: '#8585ad', marginLeft: '16px' }}
              />
            </div>
          ))}
        </div>
        <div className={styles.dialogFooter}>
          <Skeleton
            variant='text'
            width='100%'
            height={24}
            sx={{ bgcolor: '#8585ad', marginTop: '40px' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={dialogWrapperClass}>
      <div className={styles.dialogHeader}>
        <p className='text text_type_digits-default'>#{order.number}</p>
      </div>
      <div className={styles.dialogBody}>
        <p className={`text text_type_main-medium ${styles.orderName}`}>{order.name}</p>
        <OrderStatusLabel className={styles.orderStatus} order={order} />
        <div className={styles.orderIngredients}>
          <p className='text text_type_main-medium'>Состав:</p>
          <ul className={styles.orderIngredientsList}>
            {ingredientsList.map((ingredient) => (
              <li key={ingredient._id} className={styles.orderIngredientsListItem}>
                <IngredientAvatar imageSrc={ingredient.image} style={{ width: 64, height: 64 }} />
                <p className='text text_type_main-default'>{ingredient.name}</p>
                <div className={styles.orderIngredientPrice}>
                  <span className={orderPriceValueClass}>
                    {ingredient.count} x {ingredient.price}
                  </span>
                  {CurrencyIconMemo}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.dialogFooter}>
        <DateFormattedLabel date={order.createdAt} />
        <div className={styles.orderIngredientPrice}>
          <span className={orderPriceValueClass}>{totalPrice}</span>
          {CurrencyIconMemo}
        </div>
      </div>
    </div>
  )
}

export default React.memo(ModalOrderDetails)
