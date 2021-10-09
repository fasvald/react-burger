import React, { useCallback, useMemo, useRef } from 'react'

import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { useDrag, useDrop } from 'react-dnd'

import DnDItemTypes from '../../../common/constants/dnd-item-types.constant'
import { IBurgerIngredientUnique } from '../../burger-ingredients/burger-ingredients.model'
import { IBurgerConstructorIngredientProps } from '../burger-constructor.model'

import styles from './burger-constructor-ingredient-dnd.module.css'

interface IBurgerConstructorIngredientDnd extends IBurgerConstructorIngredientProps {
  moveIngredient: (id: string, atIndex: number) => void
  findIngredient: (id: string) => { topping: IBurgerIngredientUnique; index: number }
  removeIngredient: (ingredient: IBurgerIngredientUnique) => void
}

const BurgerConstructorIngredientDnd = ({
  className,
  ingredient,
  moveIngredient,
  findIngredient,
  removeIngredient,
}: IBurgerConstructorIngredientDnd): JSX.Element => {
  // Same thing as for BurgerIngredientsCard => preventing re-render, but there is an option to
  // use arrow function on ConstructorElement, because it's a last element in chain.
  const handleClose = useCallback(() => {
    removeIngredient(ingredient)
  }, [removeIngredient, ingredient])

  const originalIndex = useMemo(
    () => findIngredient(ingredient.nanoid).index,
    [findIngredient, ingredient],
  )

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(
    () => ({
      type: DnDItemTypes.INGREDIENT_TOPPING_CONSTRUCTOR_ITEM,
      item: { id: ingredient.nanoid, primaryIndex: originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, primaryIndex } = item

        const didDrop = monitor.didDrop()

        if (!didDrop) {
          moveIngredient(droppedId, primaryIndex)
        }
      },
    }),
    [originalIndex, moveIngredient],
  )

  const [, dropRef] = useDrop(
    () => ({
      accept: DnDItemTypes.INGREDIENT_TOPPING_CONSTRUCTOR_ITEM,
      canDrop: () => false,
      hover({ id: draggedId }: { id: string }) {
        if (draggedId !== ingredient.nanoid) {
          const { index: overIndex } = findIngredient(ingredient.nanoid)

          moveIngredient(draggedId, overIndex)
        }
      },
    }),
    [findIngredient, moveIngredient],
  )

  const ref = useRef<HTMLDivElement>(null)

  const DragIconMemo = useMemo(() => <DragIcon type='primary' />, [])

  const wrapperClass = useMemo(
    () => classNames(styles.wrapper, isDragging ? styles.isDragging : '', className),
    [className, isDragging],
  )

  dragRef(dropRef(ref))

  return (
    <div className={wrapperClass} ref={dragPreviewRef}>
      <div className={styles.wrapperDndIcon} ref={ref}>
        {DragIconMemo}
      </div>
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={handleClose}
      />
    </div>
  )
}

export default React.memo(BurgerConstructorIngredientDnd)
