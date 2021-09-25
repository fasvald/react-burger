import React, { useCallback, useMemo, useRef } from 'react'

import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

import { IBurgerIngredientUnique } from '../../common/models/data.model'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { burgerIngredientsStatusSelector } from '../burger-ingredients/burger-ingredients.slice'
import Loader from '../loader/loader'
import Modal from '../modal/modal'
import { IModalRefObject } from '../modal/modal.model'
import OrderDetails from '../order-details/order-details'
import {
  createOrder,
  orderDetailsSelector,
  orderDetailsStatusSelector,
} from '../order-details/order-details.slice'

import BurgerConstructorIngredientBun from './burger-constructor-ingredient-bun/burger-constructor-ingredient-bun'
import BurgerConstructorIngredientDraggable from './burger-constructor-ingredient-draggable/burger-constructor-ingredient-draggable'
import {
  burgerConstructorBunSelector,
  burgerConstructorToppingsSelector,
  selectBurgerConstructorIDs,
  selectBurgerConstructorTotalPrice,
  toppingIngredientRemove,
} from './burger-constructor.slice'

import styles from './burger-constructor.module.css'

const BurgerConstructor = (): JSX.Element => {
  const buns = useAppSelector(burgerConstructorBunSelector)
  const toppings = useAppSelector(burgerConstructorToppingsSelector)
  const ingredientsIDs = useAppSelector((state) => selectBurgerConstructorIDs(state)())
  const totalPrice = useAppSelector((state) => selectBurgerConstructorTotalPrice(state)())
  const burgerIngredientsStatus = useAppSelector(burgerIngredientsStatusSelector)
  const order = useAppSelector(orderDetailsSelector)
  const orderStatus = useAppSelector(orderDetailsStatusSelector)

  const dispatch = useAppDispatch()

  const modal = useRef<IModalRefObject>(null)

  const CurrencyIconMemo = useMemo(() => <CurrencyIcon type='primary' />, [])

  const handleRemoveIngredient = useCallback(
    (ingredient: IBurgerIngredientUnique) => {
      dispatch(toppingIngredientRemove(ingredient))
    },
    [dispatch],
  )

  const handleClick = useCallback(() => {
    // Check if burger has at least 1 topping and if there is no error from ingredients fetching
    if (burgerIngredientsStatus === 'error' || !toppings.length || !buns.length) {
      return
    }

    dispatch(createOrder({ ingredients: ingredientsIDs })).then(() => {
      modal.current?.open()
    })
  }, [dispatch, ingredientsIDs, burgerIngredientsStatus, toppings, buns])

  const priceSectionClassName = useMemo(
    () =>
      classNames(
        styles.price,
        burgerIngredientsStatus === 'error' || !toppings.length || !buns.length
          ? styles.isDisabled
          : '',
      ),
    [burgerIngredientsStatus, toppings.length, buns.length],
  )

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
      <div className={priceSectionClassName}>
        <span className={priceValueClass}>
          {totalPrice}
          {CurrencyIconMemo}
        </span>
        <Button type='primary' size='large' onClick={handleClick}>
          {(orderStatus === 'idle' || orderStatus === 'loaded') && <span>Оформить заказ</span>}
          {orderStatus === 'loading' && (
            <Loader circularProgressProps={{ size: 26, color: 'secondary' }} />
          )}
        </Button>
      </div>
      <Modal ref={modal}>{order && <OrderDetails orderDetails={order} />}</Modal>
    </section>
  )
}

export default React.memo(BurgerConstructor)
