import React, { useCallback, useMemo, useRef } from 'react'

import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { useDrop } from 'react-dnd'

import DnDItemTypes from '../../common/constants/data-dnd-item-types.constant'
import { IBurgerIngredient, IBurgerIngredientUnique } from '../../common/models/data.model'
import { useAppDispatch, useAppSelector } from '../../hooks'
import {
  addBunWithReplacement,
  addTopping,
  removeTopping,
  swapTopping,
} from '../../services/actions/burger-constructor.actions'
import { createOrder } from '../../services/actions/order-details.actions'
import {
  bunsSelector,
  selectIngredientsID,
  selectIngredientsTotalPrice,
  toppingsSelector,
} from '../../services/selectors/burger-constructor.selector'
import { ingredientsFetchStatusSelector } from '../../services/selectors/burger-ingredients.selector'
import {
  orderCreationStatusSelector,
  orderSelector,
} from '../../services/selectors/order-details.selector'
import Loader from '../loader/loader'
import Modal from '../modal/modal'
import { IModalRefObject } from '../modal/modal.model'
import OrderDetails from '../order-details/order-details'

import BurgerConstructorIngredientBun from './burger-constructor-ingredient-bun/burger-constructor-ingredient-bun'
import BurgerConstructorIngredientDraggable from './burger-constructor-ingredient-draggable/burger-constructor-ingredient-draggable'

import styles from './burger-constructor.module.css'

const BurgerConstructor = (): JSX.Element => {
  const buns = useAppSelector(bunsSelector)
  const toppings = useAppSelector(toppingsSelector)
  const ingredientsID = useAppSelector((state) => selectIngredientsID(state)())
  const totalPrice = useAppSelector((state) => selectIngredientsTotalPrice(state)())
  const order = useAppSelector(orderSelector)
  const orderCreationStatus = useAppSelector(orderCreationStatusSelector)
  const ingredientsFetchStatus = useAppSelector(ingredientsFetchStatusSelector)

  const dispatch = useAppDispatch()

  const modal = useRef<IModalRefObject>(null)

  const removeIngredient = useCallback(
    (ingredient: IBurgerIngredientUnique) => {
      dispatch(removeTopping(ingredient))
    },
    [dispatch],
  )

  const bookOrder = useCallback(() => {
    // Check if burger has at least 1 topping and if there is no error from ingredients fetching
    if (ingredientsFetchStatus === 'error' || !toppings.length || !buns.length) {
      return
    }

    dispatch(createOrder({ ingredients: ingredientsID })).then(() => {
      modal.current?.open()
    })
  }, [dispatch, ingredientsID, ingredientsFetchStatus, toppings, buns])

  const findIngredient = useCallback(
    (id: string) => {
      const topping = toppings.filter((t) => `${t.nanoid}` === id)[0]

      return {
        topping,
        index: toppings.indexOf(topping),
      }
    },
    [toppings],
  )

  const moveIngredient = useCallback(
    (id: string, atIndex: number) => {
      const { index } = findIngredient(id)

      dispatch(swapTopping(index, atIndex))
    },
    [dispatch, findIngredient],
  )

  const [{ isOver, canDrop }, ingredientsDropRef] = useDrop(() => ({
    accept: [DnDItemTypes.INGREDIENT_BUN_CARD, DnDItemTypes.INGREDIENT_TOPPING_CARD],
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop(item: { ingredient: IBurgerIngredient }, monitor) {
      if (monitor.getItemType() === DnDItemTypes.INGREDIENT_BUN_CARD) {
        dispatch(addBunWithReplacement(item.ingredient))
      }

      if (monitor.getItemType() === DnDItemTypes.INGREDIENT_TOPPING_CARD) {
        dispatch(addTopping(item.ingredient))
      }
    },
  }))

  const [, toppingsDropRef] = useDrop(() => ({
    accept: DnDItemTypes.INGREDIENT_TOPPING_CONSTRUCTOR_ITEM,
  }))

  const CurrencyIconMemo = useMemo(() => <CurrencyIcon type='primary' />, [])

  const priceSectionClassName = useMemo(
    () =>
      classNames(
        styles.price,
        ingredientsFetchStatus === 'error' || !toppings.length || !buns.length
          ? styles.isDisabled
          : '',
      ),
    [ingredientsFetchStatus, toppings.length, buns.length],
  )

  const priceValueClass = useMemo(
    () => classNames('text text_type_digits-medium', styles.priceValue),
    [],
  )

  const listClass = useMemo(
    () => classNames(styles.list, canDrop ? styles.canDrop : '', isOver ? styles.isOver : ''),
    [canDrop, isOver],
  )

  return (
    <section className={styles.section}>
      <div className={listClass} ref={ingredientsDropRef}>
        {buns?.length > 0 && (
          <BurgerConstructorIngredientBun
            className={styles.listItem}
            ingredient={buns[0]}
            direction='top'
          />
        )}
        {toppings?.length > 0 && (
          <div className={styles.listDnD} ref={toppingsDropRef}>
            {toppings.map((ingredient) => (
              <BurgerConstructorIngredientDraggable
                key={ingredient.nanoid}
                className={styles.listDnDItem}
                ingredient={ingredient}
                moveIngredient={moveIngredient}
                findIngredient={findIngredient}
                removeIngredient={removeIngredient}
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
        <Button type='primary' size='large' onClick={bookOrder}>
          {(orderCreationStatus === 'idle' || orderCreationStatus === 'loaded') && (
            <span>Оформить заказ</span>
          )}
          {orderCreationStatus === 'loading' && (
            <Loader circularProgressProps={{ size: 26, color: 'secondary' }} />
          )}
        </Button>
      </div>
      <Modal ref={modal}>{order && <OrderDetails orderDetails={order} />}</Modal>
    </section>
  )
}

export default React.memo(BurgerConstructor)
