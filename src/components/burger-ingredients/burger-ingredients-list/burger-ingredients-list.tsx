import React, { useCallback, useRef } from 'react'

import { Tab } from '@ya.praktikum/react-developer-burger-ui-components'

import { IBurgerIngredient } from '../../../common/models/data.model'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import IngredientDetails from '../../ingredient-details/ingredient-details'
import {
  ingredientDetailsSelector,
  removeIngredientDetails,
  saveIngredientDetails,
} from '../../ingredient-details/ingredient-details.slice'
import Modal from '../../modal/modal'
import { IModalRefObject } from '../../modal/modal.model'
import BurgerIngredientsCard from '../burger-ingredients-card/burger-ingredients-card'
import { selectIngredientsByType } from '../burger-ingredients.slice'

import useDynamicTabsWithIntersection from './burger-ingredients-list.utils'

import styles from './burger-ingredients-list.module.css'

const BurgerIngredientsList = (): JSX.Element => {
  const buns = useAppSelector((state) => selectIngredientsByType(state)('bun'))
  const sauces = useAppSelector((state) => selectIngredientsByType(state)('sauce'))
  const mains = useAppSelector((state) => selectIngredientsByType(state)('main'))
  const chosenIngredient = useAppSelector(ingredientDetailsSelector)

  const dispatch = useAppDispatch()

  const modal = useRef<IModalRefObject>(null)
  const rootDynamicTabsRef = useRef(null)

  const [currentListSection, setCurrentListSection] = useDynamicTabsWithIntersection(
    rootDynamicTabsRef,
    'bun',
  )

  const onClick = useCallback(
    (ingredient: IBurgerIngredient) => {
      if (modal.current) {
        modal.current.open()

        dispatch(saveIngredientDetails(ingredient))
      }
    },
    [dispatch],
  )

  const onClose = useCallback(() => {
    dispatch(removeIngredientDetails())
  }, [dispatch])

  /**
   * NOTE: We can use either useMemo or React.memo, but I've decided to use React.memo().
   * Possible enhancement => separate component.
   * For "scroll" to section we can use either or Element.scrollIntoView + behavior
   * (https://robinvdvleuten.nl/blog/scroll-a-react-component-into-view/), but it will trigger
   * useDynamicTabsWithIntersection hook :), so potentially we can write check, but it will requires tons of work
   * (https://gomakethings.com/detecting-when-a-visitor-has-stopped-scrolling-with-vanilla-javascript/).
   */
  const TabBun = React.memo(() => (
    <a href='#ingredients-buns' className={styles.tabsLink}>
      <Tab value='bun' active={currentListSection === 'bun'} onClick={setCurrentListSection}>
        Булки
      </Tab>
    </a>
  ))

  const TabSauce = React.memo(() => (
    <a href='#ingredients-sauces' className={styles.tabsLink}>
      <Tab value='sauce' active={currentListSection === 'sauce'} onClick={setCurrentListSection}>
        Соусы
      </Tab>
    </a>
  ))

  const TabMain = React.memo(() => (
    <a href='#ingredients-mains' className={styles.tabsLink}>
      <Tab value='main' active={currentListSection === 'main'} onClick={setCurrentListSection}>
        Начинки
      </Tab>
    </a>
  ))

  return (
    <div className={styles.wrapper} ref={rootDynamicTabsRef}>
      <div className={styles.tabs} data-header>
        <TabBun />
        <TabSauce />
        <TabMain />
      </div>
      <div className={styles.list} data-scroller>
        <div id='ingredients-buns' className={styles.listSection} data-section='bun'>
          <h2 className='text text_type_main-medium'>Булки</h2>
          {buns.map((bun) => (
            <BurgerIngredientsCard
              key={bun._id}
              className={styles.card}
              ingredient={bun}
              onClick={onClick}
            />
          ))}
        </div>
        <div id='ingredients-sauces' className={styles.listSection} data-section='sauce'>
          <h2 className='text text_type_main-medium'>Соусы</h2>
          {sauces.map((sauce) => (
            <BurgerIngredientsCard
              key={sauce._id}
              className={styles.card}
              ingredient={sauce}
              onClick={onClick}
            />
          ))}
        </div>
        <div id='ingredients-mains' className={styles.listSection} data-section='main'>
          <h2 className='text text_type_main-medium'>Начинки</h2>
          {mains.map((main) => (
            <BurgerIngredientsCard
              key={main._id}
              className={styles.card}
              ingredient={main}
              onClick={onClick}
            />
          ))}
        </div>
      </div>
      <Modal ref={modal} onClose={onClose}>
        {chosenIngredient && <IngredientDetails ingredient={chosenIngredient} />}
      </Modal>
    </div>
  )
}

export default React.memo(BurgerIngredientsList)
