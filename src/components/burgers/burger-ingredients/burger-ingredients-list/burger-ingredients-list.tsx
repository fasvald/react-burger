import React from 'react'

import { Tab } from '@ya.praktikum/react-developer-burger-ui-components'
import { groupBy } from 'lodash'

import ingredientsData from '../../../../common/utils/data'

import BurgerIngredientsListSection from './burger-ingredients-list-section/burger-ingredients-list-section'

import styles from './burger-ingredients-list.module.css'

const BurgerIngredientsList = (): JSX.Element => {
  const [current, setCurrent] = React.useState('bun')

  const { bun, sauce, main } = groupBy(ingredientsData, 'type')

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
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
      <div className={styles.list}>
        <BurgerIngredientsListSection ingredients={bun} className={styles.listSection}>
          <h2 className='text text_type_main-medium'>Булки</h2>
        </BurgerIngredientsListSection>
        <BurgerIngredientsListSection ingredients={sauce} className={styles.listSection}>
          <h2 className='text text_type_main-medium'>Соусы</h2>
        </BurgerIngredientsListSection>
        <BurgerIngredientsListSection ingredients={main} className={styles.listSection}>
          <h2 className='text text_type_main-medium'>Начинки</h2>
        </BurgerIngredientsListSection>
      </div>
    </div>
  )
}

export default BurgerIngredientsList
