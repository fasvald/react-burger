import React, { useMemo } from 'react'

import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { nanoid } from 'nanoid'

import calculateTotalPrice from '@components/burger-constructor/burger-constructor.utils'
import { selectIngredientsByIDs } from '@components/burger-ingredients/burger-ingredients.slice'
import DateFormatter from '@components/date-formatter/date-formatter'
import { useAppSelector } from '@hooks'
import { IOrder } from '@pages/orders-feed/orders-feed-page.model'

import OrderCardImgRow from './order-card-img-row/order-card-img-row'

import styles from './order-card.module.css'

interface IOrderCardProps {
  className?: string
  order: IOrder
}

const OrderCard = ({ className, order }: IOrderCardProps): JSX.Element => {
  const ingredients = useAppSelector((state) => selectIngredientsByIDs(state)(order.ingredients))

  const normalizedIngredients = useMemo(
    () => ingredients.map((ingredient) => ({ ...ingredient, nanoid: nanoid() })),
    [ingredients],
  )

  const totalPrice = useMemo(
    () => calculateTotalPrice(normalizedIngredients),
    [normalizedIngredients],
  )

  const priceValueClass = useMemo(
    () => classNames('text text_type_digits-default', styles.priceValue),
    [],
  )

  const cardClass = useMemo(() => classNames(className, styles.card), [className])

  const CurrencyIconMemo = useMemo(() => <CurrencyIcon type='primary' />, [])

  return (
    <div className={cardClass}>
      <div className={styles.info}>
        <span className='text text_type_digits-default'>#{order.number}</span>
        <DateFormatter date={order.createdAt} />
      </div>
      <div className={styles.title}>
        <p className='text text_type_main-medium'>{order.name}</p>
      </div>
      <div className={styles.content}>
        <OrderCardImgRow ingredients={normalizedIngredients} />
        <div className={styles.price}>
          <span className={priceValueClass}>{totalPrice}</span>
          {CurrencyIconMemo}
        </div>
      </div>
    </div>
  )
}

export default React.memo(OrderCard)
