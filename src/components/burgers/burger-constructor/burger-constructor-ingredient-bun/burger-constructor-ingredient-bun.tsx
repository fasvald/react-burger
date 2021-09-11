import { ConstructorElement } from '@ya.praktikum/react-developer-burger-ui-components';
import classNames from 'classnames';
import React from 'react';

import { IBurgerConstructorIngredientBunProps } from './burger-constructor-ingredient-bun.model';

import styles from './burger-constructor-ingredient-bun.module.css';

const BurgerConstructorIngredientBun = ({
  className,
  ingredient,
  direction,
}: IBurgerConstructorIngredientBunProps) => (
  <div className={classNames(styles.wrapper, className)}>
    <ConstructorElement
      type={direction}
      isLocked={true}
      text={`${ingredient.name} (${direction === 'top' ? 'верх' : 'низ'})`}
      price={ingredient.price}
      thumbnail={ingredient.image}
    />
  </div>
);

export default BurgerConstructorIngredientBun;
