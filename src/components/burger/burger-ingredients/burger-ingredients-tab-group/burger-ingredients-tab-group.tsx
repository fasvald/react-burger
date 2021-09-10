import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import React from 'react';
import { groupBy } from 'lodash';

import { ingredientsData } from '../../../../shared/utils/data';

import BurgerIngredientsCard from '../burger-ingredients-card/burger-ingredients-card';

import styles from './burger-ingredients-tab-group.module.css';
import { IBurgerIngredientsResItem } from '../burger-ingredients-card/burger-ingredients-card.model';

function BurgerIngredientsTabGroup() {
  const [current, setCurrent] = React.useState('bun');

  // TODO: Think to make it as array of arrays :)
  const ingredientsDataNormalized = groupBy(ingredientsData, 'type');

  return (
    <div className={styles['burger-ingredients-tab']}>
      <div className={styles['burger-ingredients-tab-header']}>
        <Tab value='bun' active={current === 'bun'} onClick={setCurrent}>
          Булки
        </Tab>
        <Tab value='sauce' active={current === 'sauce'} onClick={setCurrent}>
          Соусы
        </Tab>
        <Tab value='main' active={current === 'main'} onClick={setCurrent}>
          Начинки
        </Tab>
      </div>
      <div className={styles['burger-ingredients-tab-body']}>
        <div className={styles['burger-ingredients-tab-body-section']}>
          <h2 className='text text_type_main-medium'>Булки</h2>
          {ingredientsDataNormalized.bun.map((ingredient, index) => (
            // TODO: Remove alias
            <BurgerIngredientsCard ingredientInfo={ingredient as IBurgerIngredientsResItem} key={index} />
          ))}
        </div>
        <div className={styles['burger-ingredients-tab-body-section']}>
          <h2 className='text text_type_main-medium'>Соусы</h2>
          {ingredientsDataNormalized.sauce.map((ingredient, index) => (
            // TODO: Remove alias
            <BurgerIngredientsCard ingredientInfo={ingredient as IBurgerIngredientsResItem} key={index} />
          ))}
        </div>
        <div className={styles['burger-ingredients-tab-body-section']}>
          <h2 className='text text_type_main-medium'>Начинки</h2>
          {ingredientsDataNormalized.main.map((ingredient, index) => (
            // TODO: Remove alias
            <BurgerIngredientsCard ingredientInfo={ingredient as IBurgerIngredientsResItem} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BurgerIngredientsTabGroup;
