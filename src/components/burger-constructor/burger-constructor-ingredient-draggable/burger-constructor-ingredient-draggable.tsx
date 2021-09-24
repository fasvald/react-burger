import React, { useCallback, useMemo } from 'react'

import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

// import { useBurgerConstructor } from '../burger-constructor.context'
import { IBurgerConstructorIngredientProps } from '../burger-constructor.model'

import styles from './burger-constructor-ingredient-draggable.module.css'

const BurgerConstructorIngredientDraggable = ({
  className,
  ingredient,
}: IBurgerConstructorIngredientProps): JSX.Element => {
  const wrapperClass = useMemo(() => classNames(styles.wrapper, className), [className])

  // const { dispatch } = useBurgerConstructor()

  // const handleClose = useCallback(() => {
  //   dispatch({ type: BurgerConstructorActionKind.Remove, item: ingredient })
  // }, [dispatch, ingredient])

  return (
    <div className={wrapperClass}>
      <DragIcon type='primary' />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        // handleClose={handleClose}
      />
    </div>
  )
}

export default React.memo(BurgerConstructorIngredientDraggable)
