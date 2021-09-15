import React, { useCallback, useRef } from 'react'

import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { groupBy } from 'lodash'

import Modal from '../../modal/modal'
import { IModalRefObject } from '../../modal/modal.model'
import OrderDetails from '../../order-details/order-details'

import BurgerConstructorIngredientBun from './burger-constructor-ingredient-bun/burger-constructor-ingredient-bun'
import BurgerConstructorIngredientDraggable from './burger-constructor-ingredient-draggable/burger-constructor-ingredient-draggable'
import { IBurgerConstructorProps } from './burger-constructor.model'

import styles from './burger-constructor.module.css'

const BurgerConstructor = ({ ingredients }: IBurgerConstructorProps): JSX.Element => {
  const priceValueClass = classNames('text text_type_digits-medium', styles.priceValue)

  const { bun, sauce, main } = groupBy(ingredients, 'type')

  const modal = useRef<IModalRefObject>(null)

  const handleClick = useCallback(() => {
    if (modal.current) {
      modal.current.open()
    }
  }, [])

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
        <span className={priceValueClass}>
          610
          <CurrencyIcon type='primary' />
        </span>
        <Button type='primary' size='large' onClick={handleClick}>
          Оформить заказ
        </Button>
      </div>
      <Modal ref={modal}>
        <OrderDetails />
      </Modal>
    </section>
  )
}

export default BurgerConstructor
