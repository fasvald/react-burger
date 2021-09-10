import classNames from 'classnames';
import React from 'react';
import BurgerIngredientsCard from '../../burger-ingredients-card/burger-ingredients-card';

import { IBurgerIngredientsListSectionProps } from './burger-ingredients-list-section.model';

import styles from './burger-ingredients-list-section.module.css';

const BurgerIngredientsListSection = ({
  className,
  ingredients,
  children,
}: IBurgerIngredientsListSectionProps) => {
  return (
    <div className={classNames(styles.list, className)}>
      {children}
      {ingredients.map((ingredient, index) => (
        <BurgerIngredientsCard className={styles.card} ingredient={ingredient} key={index} />
      ))}
    </div>
  );
};

export default BurgerIngredientsListSection;
