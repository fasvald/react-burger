import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import classNames from 'classnames';
import React from 'react';

import BurgerIngredientsTabGroup from './burger-ingredients-tab-group/burger-ingredients-tab-group';

import styles from './burger-ingredients.module.css';

function BurgerIngredients () {
  return (
    <section className={styles['burger-ingredients']}>
      <h1 className={classNames('text text_type_main-large', styles['burger-ingredients-header'])}>
        Соберите бургер
      </h1>
      {/* TODO: Think about naming */}
      <BurgerIngredientsTabGroup />
    </section>
  );
}

export default BurgerIngredients;
