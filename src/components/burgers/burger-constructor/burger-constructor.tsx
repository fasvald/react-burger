import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { groupBy } from 'lodash';
import classNames from 'classnames';
import React from 'react';

import BurgerConstructorIngredientBun from './burger-constructor-ingredient-bun/burger-constructor-ingredient-bun';
import BurgerConstructorIngredientDraggable from './burger-constructor-ingredient-draggable/burger-constructor-ingredient-draggable';

import { ingredientsData } from '../../../common/utils/data';

import styles from './burger-constructor.module.css';

const BurgerConstructor = () => {
  const { bun, sauce, main } = groupBy(ingredientsData, 'type');

  return (
    <section className={styles.section}>
      <div className={styles.list}>
        <BurgerConstructorIngredientBun
          className={styles.listItem}
          ingredient={bun[0]}
          direction='top'
        />
        <div className={styles.listDnD}>
          {[...sauce, ...main].map((ingredient) => (
            <BurgerConstructorIngredientDraggable
              key={ingredient['_id']}
              className={styles.listDnDItem}
              ingredient={ingredient}
            />
          ))}
        </div>
        <BurgerConstructorIngredientBun
          className={styles.listItem}
          ingredient={bun[0]}
          direction='bottom'
        />
      </div>
      <div className={styles.price}>
        <span className={classNames('text text_type_digits-medium', styles.priceValue)}>
          610
          <CurrencyIcon type='primary' />
        </span>
        <Button type='primary' size='large'>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

export default BurgerConstructor;
