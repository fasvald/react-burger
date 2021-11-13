import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { useDrop } from 'react-dnd'
import { useNavigate, useLocation } from 'react-router-dom'

import DnDItemTypes from '@common/constants/dnd-item-types.constant'
import {
  IBurgerIngredient,
  IBurgerIngredientUnique,
} from '@components/burger-ingredients/burger-ingredients.model'
import { ingredientsSelector } from '@components/burger-ingredients/burger-ingredients.slice'
import LoaderCircular from '@components/loader-circular/loader-circular'
import Modal from '@components/modal/modal'
import ModalOrderCreationDetails from '@components/modal/modal-order-creation-details/modal-order-creation-details'
import {
  orderSelector,
  orderCreationStatusSelector,
  checkoutOrder,
} from '@components/modal/modal-order-creation-details/modal-order-creation-details.slice'
import { useAppDispatch, useAppSelector } from '@hooks'
import { authSelector } from '@services/slices/auth.slice'

import BurgerConstructorIngredientBun from './burger-constructor-ingredient-bun/burger-constructor-ingredient-bun'
import BurgerConstructorIngredientDraggable from './burger-constructor-ingredient-dnd/burger-constructor-ingredient-dnd'
import {
  bunsSelector,
  toppingsSelector,
  selectIngredientsID,
  selectIngredientsTotalPrice,
  addTopping,
  clearIngredients,
  removeTopping,
  swapTopping,
  addBun,
} from './burger-constructor.slice'

import styles from './burger-constructor.module.css'

const BurgerConstructor = (): JSX.Element => {
  const [openModal, setOpenModal] = useState(false)

  const auth = useAppSelector(authSelector)
  const buns = useAppSelector(bunsSelector)
  const toppings = useAppSelector(toppingsSelector)
  const ingredientsID = useAppSelector((state) => selectIngredientsID(state)())
  const totalPrice = useAppSelector((state) => selectIngredientsTotalPrice(state)())
  const order = useAppSelector(orderSelector)
  const orderCreationStatus = useAppSelector(orderCreationStatusSelector)
  const ingredients = useAppSelector(ingredientsSelector)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promiseRef = useRef<any>(null)

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleModalClose = useCallback(() => {
    setOpenModal(false)
  }, [])

  const removeIngredient = useCallback(
    (ingredient: IBurgerIngredientUnique) => {
      dispatch(removeTopping(ingredient))
    },
    [dispatch],
  )

  const bookOrder = useCallback(async () => {
    // Check if burger has at least 1 topping and 1 bun
    if (!toppings.length || !buns.length) {
      return
    }

    if (!auth.user) {
      navigate('/login', {
        state: {
          from: location.pathname,
        },
      })
    }

    promiseRef.current = dispatch(checkoutOrder({ ingredients: ingredientsID }))

    const resultAction = await promiseRef.current

    if (checkoutOrder.rejected.match(resultAction)) {
      return
    }

    setOpenModal(true)

    dispatch(clearIngredients())
  }, [dispatch, ingredientsID, toppings, buns, auth.user, navigate, location.pathname])

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

      dispatch(swapTopping({ toIndex: index, fromIndex: atIndex }))
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
        dispatch(addBun(item.ingredient))
      }

      if (monitor.getItemType() === DnDItemTypes.INGREDIENT_TOPPING_CARD) {
        dispatch(addTopping(item.ingredient))
      }
    },
  }))

  const [, toppingsDropRef] = useDrop(() => ({
    accept: DnDItemTypes.INGREDIENT_TOPPING_CONSTRUCTOR_ITEM,
  }))

  useEffect(() => {
    return () => {
      promiseRef.current && promiseRef.current?.abort()
    }
  }, [])

  const CurrencyIconMemo = useMemo(() => <CurrencyIcon type='primary' />, [])

  const priceSectionClass = useMemo(
    () => classNames(styles.price, !toppings.length || !buns.length ? styles.isDisabled : ''),
    [toppings.length, buns.length],
  )

  const priceValueClass = useMemo(
    () => classNames('text text_type_digits-medium', styles.priceValue),
    [],
  )

  const listClass = useMemo(
    () => classNames(styles.list, canDrop ? styles.canDrop : '', isOver ? styles.isOver : ''),
    [canDrop, isOver],
  )

  if (!ingredients) {
    return (
      <section className={styles.section}>
        <div className={styles.error}>
          <p className='text text_type_main-medium'>
            Конструктор для бургеров не может работать без ингредиентов.
          </p>
        </div>
      </section>
    )
  }

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
      <div className={priceSectionClass}>
        <span className={priceValueClass}>
          {totalPrice}
          {CurrencyIconMemo}
        </span>
        <Button type='primary' size='large' onClick={bookOrder}>
          {orderCreationStatus !== 'loading' && <span>Оформить заказ</span>}
          {orderCreationStatus === 'loading' && (
            <LoaderCircular circularProgressProps={{ size: 26, color: 'secondary' }} />
          )}
        </Button>
      </div>
      <Modal open={openModal} onClose={handleModalClose}>
        {order && <ModalOrderCreationDetails orderDetails={order} />}
      </Modal>
    </section>
  )
}

export default React.memo(BurgerConstructor)
