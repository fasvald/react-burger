import React, { useMemo } from 'react'

import { ConstructorElement } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

import { IBurgerConstructorIngredientBunProps } from './burger-constructor-ingredient-bun.model'

import styles from './burger-constructor-ingredient-bun.module.css'

const BurgerConstructorIngredientBun = ({
  className,
  ingredient,
  direction,
}: IBurgerConstructorIngredientBunProps): JSX.Element => {
  const wrapperClass = useMemo(() => classNames(styles.wrapper, className), [className])

  return (
    <div className={wrapperClass}>
      <ConstructorElement
        type={direction}
        isLocked
        text={`${ingredient.name} (${direction === 'top' ? 'верх' : 'низ'})`}
        price={ingredient.price}
        thumbnail={ingredient.image}
      />
    </div>
  )
}

export default React.memo(BurgerConstructorIngredientBun)
