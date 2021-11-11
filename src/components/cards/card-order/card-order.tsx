import React, { useMemo } from 'react'

import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { nanoid } from 'nanoid'

import { IOrder } from '@common/models/orders.model'
import calculateTotalPrice from '@components/burger-constructor/burger-constructor.utils'
import { selectIngredientsByIDs } from '@components/burger-ingredients/burger-ingredients.slice'
import DateFormattedLabel from '@components/date-formatted-label/date-formatted-label'
import { useAppSelector } from '@hooks'

import CardOrderIngredientsRow from './card-order-ingredients-row/card-order-ingredients-row'

import styles from './card-order.module.css'

interface ICardOrderProps {
  className?: string
  order: IOrder
}

const CardOrder = ({ className, order }: ICardOrderProps): JSX.Element => {
  const ingredients = useAppSelector((state) => selectIngredientsByIDs(state)(order.ingredients))

  const normalizedIngredients = useMemo(
    () => ingredients.map((ingredient) => ({ ...ingredient, nanoid: nanoid() })),
    [ingredients],
  )

  const totalPrice = useMemo(
    () => calculateTotalPrice(normalizedIngredients),
    [normalizedIngredients],
  )

  const cardClass = useMemo(() => classNames(className, styles.card), [className])

  const priceValueClass = useMemo(
    () => classNames('text text_type_digits-default', styles.priceValue),
    [],
  )

  const CurrencyIconMemo = useMemo(() => <CurrencyIcon type='primary' />, [])

  return (
    <div className={cardClass}>
      <div className={styles.info}>
        <span className='text text_type_digits-default'>#{order.number}</span>
        <DateFormattedLabel date={order.createdAt} />
      </div>
      <div className={styles.title}>
        <p className='text text_type_main-medium'>{order.name}</p>
      </div>
      <div className={styles.content}>
        <CardOrderIngredientsRow ingredients={normalizedIngredients} />
        <div className={styles.price}>
          <span className={priceValueClass}>{totalPrice}</span>
          {CurrencyIconMemo}
        </div>
      </div>
    </div>
  )
}

export default React.memo(CardOrder)
