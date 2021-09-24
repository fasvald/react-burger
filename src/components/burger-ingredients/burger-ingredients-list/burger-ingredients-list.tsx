import React, { useCallback, useRef, useState } from 'react'

import { Tab } from '@ya.praktikum/react-developer-burger-ui-components'

import { IBurgerIngredient } from '../../../common/models/data.model'
import { useAppSelector } from '../../../hooks'
import IngredientDetails from '../../ingredient-details/ingredient-details'
import Modal from '../../modal/modal'
import { IModalRefObject } from '../../modal/modal.model'
import BurgerIngredientsCard from '../burger-ingredients-card/burger-ingredients-card'
import { selectBurgerIngredientsByType } from '../burger-ingredients.slice'

import styles from './burger-ingredients-list.module.css'

const BurgerIngredientsList = (): JSX.Element => {
  const buns = useAppSelector((state) => selectBurgerIngredientsByType(state)('bun'))
  const sauces = useAppSelector((state) => selectBurgerIngredientsByType(state)('sauce'))
  const mains = useAppSelector((state) => selectBurgerIngredientsByType(state)('main'))

  const [chosenIngredient, setChosenIngredient] = useState<IBurgerIngredient>()
  // Couldn't use my own type "TBurgerIngredientType" because library component is waiting "string"
  const [currentListSection, setCurrentListSection] = useState<string>('bun')

  const modal = useRef<IModalRefObject>(null)

  const handleClick = useCallback((ingredient: IBurgerIngredient) => {
    if (modal.current) {
      modal.current.open()

      setChosenIngredient(ingredient)
    }
  }, [])

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
        {chosenIngredient && <IngredientDetails ingredient={chosenIngredient} />}
      </Modal>
    </div>
  )
}

export default React.memo(BurgerIngredientsList)