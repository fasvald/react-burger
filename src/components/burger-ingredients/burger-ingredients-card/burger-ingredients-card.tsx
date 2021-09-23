import React, { useMemo } from 'react'

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

  // const { state } = useBurgerConstructor()

  // The most easiest way how to use "Context" and calculate how many times it has duplication :)
  // Anyway, I think it should be (and will be) reworked during next step => Redux
  // const count = useMemo(() => {
  //   return state.ingredients.reduce((countValue, item) => {
  //     if (ingredient.name === item.name) {
  //       return countValue + 1
  //     }

  //     return countValue
  //   }, 0)
  // }, [ingredient.name, state.ingredients])

  return (
    <div className={cardClass} onClick={onClick} aria-hidden='true'>
      {/* {!!count && <Counter count={count} size='default' />} */}
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
