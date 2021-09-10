import React from 'react';

import { IBurgerIngredientsCardProps } from './burger-ingredients-card.model';

import styles from './burger-ingredients-card.module.css';

function BurgerIngredientsCard ({ ingredientInfo }: IBurgerIngredientsCardProps) {
  return (
    <div className={styles.card}>
      <img src={ingredientInfo.image} alt="test" />
      <p className="text text_type_digits-default">
        {ingredientInfo.price} $
      </p>
      <p className="text text_type_main-default">
        {ingredientInfo.name}
      </p>
    </div>
  )
}

export default BurgerIngredientsCard;
