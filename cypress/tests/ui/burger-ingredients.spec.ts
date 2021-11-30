/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'cypress-wait-until'
import 'cypress-pipe'

import BurgerIngredients from '../../pages/burger-ingredients'
import BurgerIngredientsList from '../../pages/burger-ingredients-list'
import Modal from '../../pages/modal'
import ModalIngredientDetails from '../../pages/modal-ingredient-details'

interface IBurgerIngredient {
  _id: string
  name: string
  type: 'bun' | 'sauce' | 'main'
  proteins: number
  fat: number
  carbohydrates: number
  calories: number
  price: number
  image: string
  image_mobile: string
  image_large: string
  __v: number
}

interface IIngredientDetailsState {
  ingredient: IBurgerIngredient
}

describe('Burger Ingredients Component + insides', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('Source Component', () => {
    it('should rendered component-wrapper with ingredients', () => {
      const burgerIngredients = new BurgerIngredients()

      burgerIngredients.element.should('exist')
      burgerIngredients.element.should('be.visible')
    })

    it('should render header with correct title', () => {
      const burgerIngredients = new BurgerIngredients()

      burgerIngredients.header.should('exist')
      burgerIngredients.header.contains('Соберите бургер')
    })
  })

  context('Burger Ingredients Component', () => {
    it('should rendered ingredients list', () => {
      const burgerIngredientsList = new BurgerIngredientsList()

      burgerIngredientsList.element.should('exist')
      burgerIngredientsList.element.should('be.visible')
    })

    it('should rendered tabs with correct naming for groups of ingredients', () => {
      const burgerIngredientsList = new BurgerIngredientsList()

      burgerIngredientsList.tabBun.should('contain.text', 'Булки')
      burgerIngredientsList.tabSauce.should('contain.text', 'Соусы')
      burgerIngredientsList.tabMain.should('contain.text', 'Начинки')
    })

    it('should rendered list of ingredients splitted on groups based on ingredient types', () => {
      const burgerIngredientsList = new BurgerIngredientsList()

      burgerIngredientsList.groupBuns.should('contain.text', 'Булки')
      burgerIngredientsList.groupSauces.should('contain.text', 'Соусы')
      burgerIngredientsList.groupMains.should('contain.text', 'Начинки')
    })
  })

  context('Modal Dialog Appearance', () => {
    it('should click on ingredient card and show modal dialog with correct details', () => {
      const ingredientList = new BurgerIngredientsList()
      const modal = new Modal()
      const modalIngredientDetails = new ModalIngredientDetails()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getIngredientDetails = (window: any): IIngredientDetailsState =>
        window.store.getState().ingredientDetails

      ingredientList.getCardFromGroup(ingredientList.groupBuns, 0).click()

      modal.element.should('exist').should('exist').should('be.visible').should('not.be.empty')

      cy.window()
        .pipe<IIngredientDetailsState>(getIngredientDetails)
        .then(({ ingredient }) => {
          modalIngredientDetails.image
            .should('have.css', 'background-image')
            .and('include', ingredient.image_large)

          modalIngredientDetails.name.should('have.text', ingredient.name)

          modalIngredientDetails.foodEnergy.should('exist').should('be.visible')
        })
    })

    it('should click on ingredient card , show modal and close it via "esc"', () => {
      const ingredientList = new BurgerIngredientsList()
      const modal = new Modal()

      ingredientList.getCardFromGroup(ingredientList.groupBuns, 0).click()

      cy.waitUntil(() => modal.element)

      modal.element.should('exist').should('exist').should('be.visible').should('not.be.empty')

      modal.closeBtn.click()

      modal.element.should('not.exist')
    })

    it('should click on ingredient card , show modal and close it via "esc"', () => {
      const ingredientList = new BurgerIngredientsList()
      const modal = new Modal()

      ingredientList.getCardFromGroup(ingredientList.groupBuns, 0).click()

      cy.waitUntil(() => modal.element)

      modal.element.should('exist').should('exist').should('be.visible').should('not.be.empty')

      cy.get('body').trigger('keydown', { keyCode: 27 })

      modal.element.should('not.exist')
    })
  })
})
