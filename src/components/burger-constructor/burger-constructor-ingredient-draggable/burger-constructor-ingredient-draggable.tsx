import React, { useCallback, useMemo, useRef } from 'react'

import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'
import { useDrag, useDrop } from 'react-dnd'

import { IBurgerConstructorIngredientDraggable } from './burger-constructor-ingredient-draggable.model'

import styles from './burger-constructor-ingredient-draggable.module.css'

const BurgerConstructorIngredientDraggable = ({
  className,
  ingredient,
  id,
  moveCard,
  findCard,
  handleRemove,
}: IBurgerConstructorIngredientDraggable): JSX.Element => {
  const DragIconMemo = useMemo(() => <DragIcon type='primary' />, [])

  // Same thing as for BurgerIngredientsCard => preventing re-render, but there is an option to
  // use arrow function on ConstructorElement, because it's a last element in chain.
  const handleClose = useCallback(() => {
    handleRemove(ingredient)
  }, [handleRemove, ingredient])

  const originalIndex = findCard(id).index

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'TEST',

      item: { id, originalIndexx: originalIndex },

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),

      end: (item, monitor) => {
        const { id: droppedId, originalIndexx } = item

        const didDrop = monitor.didDrop()

        if (!didDrop) {
          moveCard(droppedId, originalIndexx)
        }
      },
    }),

    [id, originalIndex, moveCard],
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'TEST',

      canDrop: () => false,

      hover({ id: draggedId }: any) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id)

          moveCard(draggedId, overIndex)
        }
      },
    }),
    [findCard, moveCard],
  )

  const ref = useRef<HTMLDivElement>(null)

  drag(drop(ref))

  const wrapperClass = useMemo(
    () => classNames(styles.wrapper, isDragging ? styles.isDragging : '', className),
    [className, isDragging],
  )

  return (
    <div className={wrapperClass} ref={dragPreview}>
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
