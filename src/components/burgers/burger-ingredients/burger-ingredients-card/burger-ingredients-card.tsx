import React from 'react'

import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

import { IBurgerIngredientsCardProps } from './burger-ingredients-card.model'

import styles from './burger-ingredients-card.module.css'

const BurgerIngredientsCard = ({
  ingredient,
  className,
  onClick,
}: IBurgerIngredientsCardProps): JSX.Element => {
  const cardClass = classNames(styles.card, className)
  const priceValueClass = classNames('text text_type_digits-default', styles.priceValue)
  const titleValueClass = classNames('text text_type_main-default', styles.titleValue)

  return (
    <div className={cardClass} onClick={onClick} aria-hidden='true'>
      <Counter count={1} size='default' />
      <img src={ingredient.image} alt='test' className={styles.img} />
      <div className={styles.price}>
        <span className={priceValueClass}>{ingredient.price}</span>
        <CurrencyIcon type='primary' />
      </div>
      <div className={styles.title}>
        <span className={titleValueClass}>{ingredient.name}</span>
      </div>
    </div>
  )
}

export default React.memo(BurgerIngredientsCard)
