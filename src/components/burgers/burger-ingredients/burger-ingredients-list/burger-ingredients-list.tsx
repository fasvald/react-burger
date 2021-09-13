import React, { useRef, useState } from 'react'

import { Tab } from '@ya.praktikum/react-developer-burger-ui-components'
import { groupBy } from 'lodash'

import { IBurgerIngredient } from '../../../../common/models/data.model'
import Modal from '../../../modal/modal'
import BurgerIngredientsCard from '../burger-ingredients-card/burger-ingredients-card'

import { IBurgerIngredientsListProps } from './burger-ingredients-list.model'

import styles from './burger-ingredients-list.module.css'

const BurgerIngredientsList = ({ ingredients }: IBurgerIngredientsListProps): JSX.Element => {
  const [chosenIngredient, setChosenIngredient] = useState()
  const [currentListSection, setCurrentListSection] = useState('bun')

  // TODO: fix typings
  const modal = useRef(null) as any

  const { bun: buns, sauce: sauces, main: mains } = groupBy(ingredients, 'type')

  const handleClick = (ingredient: IBurgerIngredient) => {
    if (modal.current) {
      modal.current.open()
      // TODO: fix typings
      setChosenIngredient(ingredient as any)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <Tab value='bun' active={currentListSection === 'bun'} onClick={setCurrentListSection}>
          Булки
        </Tab>
        <Tab value='sauce' active={currentListSection === 'sauce'} onClick={setCurrentListSection}>
          Соусы
        </Tab>
        <Tab value='main' active={currentListSection === 'main'} onClick={setCurrentListSection}>
          Начинки
        </Tab>
      </div>
      <div className={styles.list}>
        <div className={styles.listSection}>
          <h2 className='text text_type_main-medium'>Булки</h2>
          {buns.map((bun) => (
            <BurgerIngredientsCard
              key={bun._id}
              className={styles.card}
              ingredient={bun}
              onClick={() => handleClick(bun)}
            />
          ))}
        </div>
        <div className={styles.listSection}>
          <h2 className='text text_type_main-medium'>Соусы</h2>
          {sauces.map((sauce) => (
            <BurgerIngredientsCard
              key={sauce._id}
              className={styles.card}
              ingredient={sauce}
              onClick={() => handleClick(sauce)}
            />
          ))}
        </div>
        <div className={styles.listSection}>
          <h2 className='text text_type_main-medium'>Начинки</h2>
          {mains.map((main) => (
            <BurgerIngredientsCard
              key={main._id}
              className={styles.card}
              ingredient={main}
              onClick={() => handleClick(main)}
            />
          ))}
        </div>
      </div>
      <Modal ref={modal}>
        <div>
          <p>Ingredient:</p>
          <p>{JSON.stringify(chosenIngredient)}</p>
        </div>
      </Modal>
    </div>
  )
}

export default BurgerIngredientsList
