import React from 'react'

import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { groupBy } from 'lodash'

import BurgerConstructorIngredientBun from './burger-constructor-ingredient-bun/burger-constructor-ingredient-bun'
import BurgerConstructorIngredientDraggable from './burger-constructor-ingredient-draggable/burger-constructor-ingredient-draggable'
import { IBurgerConstructorProps } from './burger-constructor.model'

import styles from './burger-constructor.module.css'

const BurgerConstructor = ({ ingredients }: IBurgerConstructorProps): JSX.Element => {
  const { bun, sauce, main } = groupBy(ingredients, 'type')

  return (
    <section className={styles.section}>
      <div className={styles.list}>
        <BurgerConstructorIngredientBun
          className={styles.listItem}
          ingredient={bun[0]}
          direction='top'
        />
        <div className={styles.listDnD}>
          {[...sauce, ...main].map((ingredient) => (
            <BurgerConstructorIngredientDraggable
              key={ingredient._id}
              className={styles.listDnDItem}
              ingredient={ingredient}
            />
          ))}
        </div>
        <BurgerConstructorIngredientBun
          className={styles.listItem}
          ingredient={bun[0]}
          direction='bottom'
        />
      </div>
      <div className={styles.price}>
        <span className={classNames('text text_type_digits-medium', styles.priceValue)}>
          610
          <CurrencyIcon type='primary' />
        </span>
        <Button type='primary' size='large'>
          Оформить заказ
        </Button>
      </div>
    </section>
  )
}

export default BurgerConstructor
