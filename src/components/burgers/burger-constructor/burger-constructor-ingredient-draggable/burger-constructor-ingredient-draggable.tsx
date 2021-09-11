import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import classNames from 'classnames';
import React from 'react';

import { IBurgerConstructorIngredientProps } from '../burger-constructor.model';

import styles from './burger-constructor-ingredient-draggable.module.css';

const BurgerConstructorIngredientDraggable = ({
  className,
  ingredient,
}: IBurgerConstructorIngredientProps) => (
  <div className={classNames(styles.wrapper, className)}>
    <DragIcon type='primary' />
    <ConstructorElement
      text={ingredient.name}
      price={ingredient.price}
      thumbnail={ingredient.image}
    />
  </div>
);

export default BurgerConstructorIngredientDraggable;
