import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

import { IBurgerIngredientUnique } from '../../common/models/data.model'
import { useAppDispatch, useAppSelector } from '../../hooks'
import Loader from '../loader/loader'
import Modal from '../modal/modal'
import { IModalRefObject } from '../modal/modal.model'
import OrderDetails from '../order-details/order-details'

import BurgerConstructorIngredientBun from './burger-constructor-ingredient-bun/burger-constructor-ingredient-bun'
import BurgerConstructorIngredientDraggable from './burger-constructor-ingredient-draggable/burger-constructor-ingredient-draggable'
// import { useBurgerConstructor } from './burger-constructor.context'
import {
  burgerConstructorBunSelector,
  burgerConstructorToppingsSelector,
  selectBurgerConstructorTotalPrice,
  toppingIngredientRemove,
} from './burger-constructor.slice'

import styles from './burger-constructor.module.css'

const BurgerConstructor = (): JSX.Element => {
  const dispatch = useAppDispatch()

  const buns = useAppSelector(burgerConstructorBunSelector)
  const toppings = useAppSelector(burgerConstructorToppingsSelector)
  const totalPrice = useAppSelector(selectBurgerConstructorTotalPrice)

  const modal = useRef<IModalRefObject>(null)

  const handleRemoveIngredient = useCallback(
    (ingredient: IBurgerIngredientUnique) => {
      dispatch(toppingIngredientRemove(ingredient))
    },
    [dispatch],
  )

  /* const handleClick = useCallback(() => {
    // You can create an order only if you add at least one bun
    if (state.ingredients.some((ingredient) => ingredient.type === 'bun')) {
      createOrder({ ingredients: state.ingredients.map((ingredient) => ingredient._id) }, () => {
        if (modal?.current) {
          modal.current.open()
        }
      })
    }
  }, [createOrder, state.ingredients]) */

  // To be sure that the request will be aborted during unmount, and we need to silent a warning here
  // eslint-disable-next-line react-hooks/exhaustive-deps

  /* useEffect(() => () => controller?.abort(), []) */

  const priceValueClass = useMemo(
    () => classNames('text text_type_digits-medium', styles.priceValue),
    [],
  )

  return (
    <section className={styles.section}>
      <div className={styles.list}>
        {buns?.length > 0 && (
          <BurgerConstructorIngredientBun
            className={styles.listItem}
            ingredient={buns[0]}
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
                handleRemove={handleRemoveIngredient}
              />
            ))}
          </div>
        )}
        {buns?.length > 0 && (
          <BurgerConstructorIngredientBun
            className={styles.listItem}
            ingredient={buns[0]}
            direction='bottom'
          />
        )}
      </div>
      <div className={styles.price}>
        <span className={priceValueClass}>
          {totalPrice}
          <CurrencyIcon type='primary' />
        </span>
        <Button type='primary' size='large'>
          <span>Оформить заказ</span>
          {/* {(status === 'idle' || status === 'loaded') && <span>Оформить заказ</span>}
          {status === 'loading' && (
            <Loader circularProgressProps={{ size: 20, color: 'secondary' }} />
          )} */}
        </Button>
      </div>
      {/* <Modal ref={modal}>{order && <OrderDetails orderDetails={order} />}</Modal> */}
    </section>
  )
}

export default React.memo(BurgerConstructor)
