import React, { useCallback, useMemo } from 'react'

import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

import { IBurgerConstructorIngredientDraggable } from './burger-constructor-ingredient-draggable.model'

import styles from './burger-constructor-ingredient-draggable.module.css'

const BurgerConstructorIngredientDraggable = ({
  className,
  ingredient,
  handleRemove,
}: IBurgerConstructorIngredientDraggable): JSX.Element => {
  const DragIconMemo = useMemo(() => <DragIcon type='primary' />, [])
  const wrapperClass = useMemo(() => classNames(styles.wrapper, className), [className])

  // Same thing as for BurgerIngredientsCard => preventing re-render, but there is an option to
  // use arrow function on ConstructorElement, because it's a last element in chain.
  const handleClose = useCallback(() => {
    handleRemove(ingredient)
  }, [handleRemove, ingredient])

  return (
    <div className={wrapperClass}>
      {DragIconMemo}
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
