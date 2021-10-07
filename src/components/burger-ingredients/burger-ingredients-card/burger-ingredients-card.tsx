import React, { useCallback, useMemo } from 'react'

import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { useDrag } from 'react-dnd'

import DnDItemTypes from '../../../common/constants/dnd-item-types.constant'
import { useAppSelector } from '../../../hooks'
import { selectIngredientIterationByID } from '../../burger-constructor/burger-constructor.slice'

import { IBurgerIngredientsCardProps } from './burger-ingredients-card.model'

import styles from './burger-ingredients-card.module.css'

const BurgerIngredientsCard = ({
  ingredient,
  className,
  onClick,
}: IBurgerIngredientsCardProps): JSX.Element => {
  // The most easiest way how to use Redux + Reselect :) and calculate how many times it has duplication :)
  const count = useAppSelector((state) => selectIngredientIterationByID(state)(ingredient._id))

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type:
      ingredient.type === 'bun'
        ? DnDItemTypes.INGREDIENT_BUN_CARD
        : DnDItemTypes.INGREDIENT_TOPPING_CARD,
    item: { ingredient },
    options: {
      dropEffect: 'copy',
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  /**
   * Because of passing it like arrow function it will cause the re-render of the card.
   * So we can do it like this down below, to prevent re-render, or make it like this:
   * <div className={cardClass} onClick={() => onClick(ingredient)} aria-hidden='true'>
   */
  const onClickWrapper = useCallback(() => {
    onClick(ingredient)
  }, [ingredient, onClick])

  const CurrencyIconMemo = useMemo(() => <CurrencyIcon type='primary' />, [])

  const CounterMemo = useMemo(
    () => (
      <div className={styles.cardCounter}>
        <Counter count={count} size='default' />
      </div>
    ),
    [count],
  )

  const cardClass = useMemo(
    () => classNames(styles.card, className, isDragging ? styles.isDragging : ''),
    [className, isDragging],
  )

  const priceValueClass = useMemo(
    () => classNames('text text_type_digits-default', styles.priceValue),
    [],
  )

  const titleValueClass = useMemo(
    () => classNames('text text_type_main-default', styles.titleValue),
    [],
  )

  return (
    <div className={cardClass} onClick={onClickWrapper} ref={dragRef} aria-hidden='true'>
      {!!count && CounterMemo}
      <img src={ingredient.image} alt='test' className={styles.img} />
      <div className={styles.price}>
        <span className={priceValueClass}>{ingredient.price}</span>
        {CurrencyIconMemo}
      </div>
      <div className={styles.title}>
        <span className={titleValueClass}>{ingredient.name}</span>
      </div>
    </div>
  )
}

export default React.memo(BurgerIngredientsCard)
