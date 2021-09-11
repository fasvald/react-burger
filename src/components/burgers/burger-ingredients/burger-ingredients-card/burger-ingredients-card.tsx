import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import classNames from 'classnames';
import React from 'react';

import { IBurgerIngredientsCardProps } from './burger-ingredients-card.model';

import styles from './burger-ingredients-card.module.css';

function BurgerIngredientsCard({ ingredient, className }: IBurgerIngredientsCardProps) {
  return (
    <div className={classNames(styles.card, className)}>
      <Counter count={1} size="default" />
      <img src={ingredient.image} alt='test' />
      <div className={styles.price}>
        <span className={classNames('text text_type_digits-default', styles.priceValue)}>
          {ingredient.price}
        </span>
        <CurrencyIcon type='primary' />
      </div>
      <div className={styles.title}>
        <span className={classNames('text text_type_main-default', styles.titleValue)}>
          {ingredient.name}
        </span>
      </div>
    </div>
  );
}

export default BurgerIngredientsCard;
