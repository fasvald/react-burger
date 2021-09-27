import React, { useCallback, useMemo, useRef } from 'react'

import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { useDrag, useDrop } from 'react-dnd'

import DnDItemTypes from '../../../common/constants/data-dnd-item-types.constant'

import { IBurgerConstructorIngredientDraggable } from './burger-constructor-ingredient-draggable.model'

import styles from './burger-constructor-ingredient-draggable.module.css'

const BurgerConstructorIngredientDraggable = ({
  className,
  ingredient,
  moveIngredient,
  findIngredient,
  removeIngredient,
}: IBurgerConstructorIngredientDraggable): JSX.Element => {
  const DragIconMemo = useMemo(() => <DragIcon type='primary' />, [])

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

export default React.memo(BurgerConstructorIngredientDraggable)
