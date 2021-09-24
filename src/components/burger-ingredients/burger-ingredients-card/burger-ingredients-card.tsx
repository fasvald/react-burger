import React, { useCallback, useMemo } from 'react'

import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

import { useAppSelector } from '../../../hooks'
import { selectBurgerConstructorIngredientCountById } from '../../burger-constructor/burger-constructor.slice'

import { IBurgerIngredientsCardProps } from './burger-ingredients-card.model'

import styles from './burger-ingredients-card.module.css'

const BurgerIngredientsCard = ({
  ingredient,
  className,
  onClick,
}: IBurgerIngredientsCardProps): JSX.Element => {
  const cardClass = useMemo(() => classNames(styles.card, className), [className])
  const priceValueClass = useMemo(
    () => classNames('text text_type_digits-default', styles.priceValue),
    [],
  )
  const titleValueClass = useMemo(
    () => classNames('text text_type_main-default', styles.titleValue),
    [],
  )

  // The most easiest way how to use Redux + Reselect :) and calculate how many times it has duplication :)
  const count = useAppSelector((state) =>
    selectBurgerConstructorIngredientCountById(state)(ingredient._id),
  )

  const CurrencyIconMemo = useMemo(() => <CurrencyIcon type='primary' />, [])

  // Because of passing it like arrow function it will cause the re-render of the card.
  // So we can do it like this down below, to prevent re-render, or make it like this:
  // <div className={cardClass} onClick={() => onClick(ingredient)} aria-hidden='true'>
  const handleClick = useCallback(() => {
    onClick(ingredient)
  }, [ingredient, onClick])

  return (
    <div className={cardClass} onClick={handleClick} aria-hidden='true'>
      {!!count && <Counter count={count} size='default' />}
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
