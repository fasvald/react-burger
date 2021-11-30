import React, { useMemo } from 'react'

import { ConstructorElement } from '@ya.praktikum/react-developer-burger-ui-components'
import classNames from 'classnames'

import { IBurgerConstructorIngredientProps } from '../burger-constructor.model'

import styles from './burger-constructor-ingredient-bun.module.css'

interface IBurgerConstructorIngredientBunProps extends IBurgerConstructorIngredientProps {
  direction: 'top' | 'bottom'
}

const BurgerConstructorIngredientBun = ({
  className,
  ingredient,
  direction,
}: IBurgerConstructorIngredientBunProps): JSX.Element => {
  const wrapperClass = useMemo(() => classNames(styles.wrapper, className), [className])

  return (
    <div data-test='burger-constructor-ingredient-bun' className={wrapperClass}>
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
