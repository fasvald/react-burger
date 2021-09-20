import React, { useCallback, useMemo, useRef } from 'react'

import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

import Modal from '../../modal/modal'
import { IModalRefObject } from '../../modal/modal.model'
import OrderDetails from '../../order-details/order-details'

import BurgerConstructorIngredientBun from './burger-constructor-ingredient-bun/burger-constructor-ingredient-bun'
import BurgerConstructorIngredientDraggable from './burger-constructor-ingredient-draggable/burger-constructor-ingredient-draggable'
import { useBurgerConstructor } from './burger-constructor.context'
import { calculateTotalPrice, groupIngredients } from './burger-constructor.utils'

import styles from './burger-constructor.module.css'

const BurgerConstructor = (): JSX.Element => {
  const priceValueClass = classNames('text text_type_digits-medium', styles.priceValue)

  const { state } = useBurgerConstructor()

  const modal = useRef<IModalRefObject>(null)

  const { bun, toppings } = useMemo(() => groupIngredients(state.ingredients), [state.ingredients])

  const totalPrice = useMemo(() => calculateTotalPrice(state.ingredients), [state.ingredients])

  const handleClick = useCallback(() => {
    if (modal.current) {
      modal.current.open()
    }
  }, [])

  return (
    <section className={styles.section}>
      <div className={styles.list}>
        {bun?.length > 0 && (
          <BurgerConstructorIngredientBun
            className={styles.listItem}
            ingredient={bun[0]}
            direction='top'
          />
        )}
        {toppings?.length > 0 && (
          <div className={styles.listDnD}>
            {toppings.map((ingredient) => (
              <BurgerConstructorIngredientDraggable
                key={ingredient.nanoid}
                className={styles.listDnDItem}
                ingredient={ingredient}
              />
            ))}
          </div>
        )}
        {bun?.length > 0 && (
          <BurgerConstructorIngredientBun
            className={styles.listItem}
            ingredient={bun[0]}
            direction='bottom'
          />
        )}
      </div>
      <div className={styles.price}>
        <span className={priceValueClass}>
          {totalPrice}
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

export default React.memo(BurgerConstructor)
