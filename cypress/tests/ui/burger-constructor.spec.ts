/* eslint-disable @typescript-eslint/ban-ts-comment */

import 'cypress-wait-until'
import '@4tw/cypress-drag-drop'

import BurgerConstructor from '../../pages/burger-constructor'
import BurgerIngredientsList from '../../pages/burger-ingredients-list'
import Modal from '../../pages/modal'
import ModalOrderCreationDetails from '../../pages/modal-order-creation-details'

describe('Burger Constructor Component + insides', () => {
  context('Source Component', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('should rendered component-wrapper with necessary elements (order creation button, total price value)', () => {
      const burgerConstructor = new BurgerConstructor()

      burgerConstructor.element.should('exist')
      burgerConstructor.element.should('be.visible')

      burgerConstructor.btnOrderCreation.should('exist')
      burgerConstructor.btnOrderCreation.should('be.visible')

      burgerConstructor.orderCreationTotalPrice.should('exist')
      burgerConstructor.orderCreationTotalPrice.should('be.visible')
    })
  })

  context('DnD from "Burger Ingredients List Component"', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('should move ingredient from "buns" group to a valid place', () => {
      const ingredientList = new BurgerIngredientsList()
      const burgerConstructor = new BurgerConstructor()

      // NOTE: Another option how to trigger DnD events
      // ingredientList.getCardFromGroup(ingredientList.groupBuns, 0).trigger('dragstart')
      // burgerConstructor.dropContainer.trigger('drop')

      ingredientList
        .getCardFromGroup(ingredientList.groupBuns, 0)
        .drag(burgerConstructor.dropContainerSelector)
        // @ts-ignore
        .then((success: boolean) => {
          assert.isTrue(success)
        })

      burgerConstructor.bunsIngredients.should('exist')
      burgerConstructor.bunsIngredients.should('have.length', 2)
      burgerConstructor.bunsIngredients.each(($bunIngredient) => {
        cy.wrap($bunIngredient).should('exist')
        cy.wrap($bunIngredient).should('be.visible')
      })
    })

    it('should move ingredient from "sauces" group to a valid place', () => {
      const ingredientList = new BurgerIngredientsList()
      const burgerConstructor = new BurgerConstructor()

      ingredientList
        .getCardFromGroup(ingredientList.groupSauces, 0)
        .drag(burgerConstructor.dropContainerSelector)
        // @ts-ignore
        .then((success: boolean) => {
          assert.isTrue(success)
        })

      burgerConstructor.toppingsIngredients.should('exist')
      burgerConstructor.toppingsIngredients.should('have.length', 1)
      burgerConstructor.toppingsIngredients.each(($toppingIngredient) => {
        cy.wrap($toppingIngredient).should('exist')
        cy.wrap($toppingIngredient).should('be.visible')
      })
    })

    it('should move ingredient from "mains" group to a valid place', () => {
      const ingredientList = new BurgerIngredientsList()
      const burgerConstructor = new BurgerConstructor()

      ingredientList
        .getCardFromGroup(ingredientList.groupMains, 0)
        .drag(burgerConstructor.dropContainerSelector)
        // @ts-ignore
        .then((success: boolean) => {
          assert.isTrue(success)
        })

      burgerConstructor.toppingsIngredients.should('exist')
      burgerConstructor.toppingsIngredients.should('have.length', 1)
      burgerConstructor.toppingsIngredients.each(($toppingIngredient) => {
        cy.wrap($toppingIngredient).should('exist')
        cy.wrap($toppingIngredient).should('be.visible')
      })
    })

    it('should correctly add counter to ingredient card after moving card to constructor', () => {
      const ingredientList = new BurgerIngredientsList()
      const burgerConstructor = new BurgerConstructor()

      // NOTE: Library-plugin for dnd is not working correctly with multiple trigger, so we are suing native approach

      ingredientList.getCardFromGroup(ingredientList.groupSauces, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList
        .getCardFromGroup(ingredientList.groupSauces, 0)
        .getBySel('burger-ingredient-card-counter')
        .should('have.text', 1)

      ingredientList.getCardFromGroup(ingredientList.groupSauces, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')
      ingredientList.getCardFromGroup(ingredientList.groupSauces, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')
      ingredientList.getCardFromGroup(ingredientList.groupSauces, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList
        .getCardFromGroup(ingredientList.groupSauces, 0)
        .getBySel('burger-ingredient-card-counter')
        .should('have.text', 4)
    })

    it('should correctly remove ingredient from constructor', () => {
      const ingredientList = new BurgerIngredientsList()
      const burgerConstructor = new BurgerConstructor()

      ingredientList.getCardFromGroup(ingredientList.groupSauces, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      burgerConstructor.toppingsIngredients.should('have.length', 1)

      burgerConstructor.toppingsIngredients.eq(0).get('.constructor-element__action').click()

      burgerConstructor.toppingsIngredients.should('have.length', 0)

      ingredientList
        .getCardFromGroup(ingredientList.groupSauces, 0)
        .getBySel('burger-ingredient-card-counter')
        .should('not.exist')
    })
  })

  context('Order Creation Possibility', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('should correctly calculate total price from chosen ingredients', () => {
      const ingredientList = new BurgerIngredientsList()
      const burgerConstructor = new BurgerConstructor()

      ingredientList.getCardFromGroup(ingredientList.groupBuns, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList.getCardFromGroup(ingredientList.groupSauces, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList.getCardFromGroup(ingredientList.groupMains, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      burgerConstructor.orderCreationTotalPrice.invoke('text').then(($totalPrice) => {
        burgerConstructor.droppedIngredients
          .get('.constructor-element__price')
          .then(($els) =>
            Cypress._.map($els, 'innerText').reduce(
              (totalPrice, ingredientPrice) => totalPrice + parseInt(ingredientPrice, 10),
              0,
            ),
          )
          .should('eq', parseInt($totalPrice, 10))
      })
    })

    it('should disable order creation button if no ingredients', () => {
      const burgerConstructor = new BurgerConstructor()

      burgerConstructor.dropContainer.should('exist')
      burgerConstructor.dropContainer.should('be.empty')

      burgerConstructor.orderCreationSection
        .should('exist')
        .should('have.prop', 'classList')
        .then(Array.from)
        .invoke('some', (className: string) => className.includes('isDisabled'))
        .should('be.true')

      burgerConstructor.btnOrderCreation
        .should('exist')
        .should('be.visible')
        .should('have.css', 'cursor', 'not-allowed')
    })

    it('should enable order creation button if there are at least one bun and other ingredients', () => {
      const ingredientList = new BurgerIngredientsList()
      const burgerConstructor = new BurgerConstructor()

      ingredientList.getCardFromGroup(ingredientList.groupBuns, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList.getCardFromGroup(ingredientList.groupSauces, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList.getCardFromGroup(ingredientList.groupMains, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      burgerConstructor.dropContainer.should('exist')
      burgerConstructor.dropContainer.should('not.be.empty')

      burgerConstructor.orderCreationSection
        .should('exist')
        .should('have.prop', 'classList')
        .then(Array.from)
        .invoke('some', (className: string) => className.includes('isDisabled'))
        .should('be.false')

      burgerConstructor.btnOrderCreation
        .should('exist')
        .should('be.visible')
        .should('not.have.css', 'cursor', 'not-allowed')
    })
  })

  context('Modal Dialog Appearance', () => {
    beforeEach(function () {
      cy.fixture('user').as('user')
      cy.fixture('order').as('orderDetails')
    })

    beforeEach(function () {
      cy.login(this.user.email, this.user.password)
    })

    it('should successfully create order and show modal dialog with correct details', function () {
      const ingredientList = new BurgerIngredientsList()
      const burgerConstructor = new BurgerConstructor()
      const modal = new Modal()
      const modalOrderDetails = new ModalOrderCreationDetails()

      cy.intercept(
        {
          method: 'POST',
          url: 'https://norma.nomoreparties.space/api/orders',
        },
        { fixture: 'order.json' },
      ).as('orderCreation')

      ingredientList.getCardFromGroup(ingredientList.groupBuns, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList.getCardFromGroup(ingredientList.groupSauces, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList.getCardFromGroup(ingredientList.groupMains, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      burgerConstructor.btnOrderCreation.click()

      cy.wait('@orderCreation')
      cy.waitUntil(() => modal.element)

      modal.element.should('exist').should('exist').should('be.visible').should('not.be.empty')
      modalOrderDetails.orderNumber.first().should('have.text', this.orderDetails.order.number)
    })

    it('should create order, show modal and close it via button', function () {
      const ingredientList = new BurgerIngredientsList()
      const burgerConstructor = new BurgerConstructor()
      const modal = new Modal()

      cy.intercept(
        {
          method: 'POST',
          url: 'https://norma.nomoreparties.space/api/orders',
        },
        { fixture: 'order.json' },
      ).as('orderCreation')

      ingredientList.getCardFromGroup(ingredientList.groupBuns, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList.getCardFromGroup(ingredientList.groupSauces, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList.getCardFromGroup(ingredientList.groupMains, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      burgerConstructor.btnOrderCreation.click()

      cy.wait('@orderCreation')
      cy.waitUntil(() => modal.element)

      modal.element.should('exist').should('exist').should('be.visible').should('not.be.empty')

      modal.closeBtn.click()

      modal.element.should('not.exist')
    })

    it('should create order, show modal and close it via "esc"', function () {
      const ingredientList = new BurgerIngredientsList()
      const burgerConstructor = new BurgerConstructor()
      const modal = new Modal()

      cy.intercept(
        {
          method: 'POST',
          url: 'https://norma.nomoreparties.space/api/orders',
        },
        { fixture: 'order.json' },
      ).as('orderCreation')

      ingredientList.getCardFromGroup(ingredientList.groupBuns, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList.getCardFromGroup(ingredientList.groupSauces, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      ingredientList.getCardFromGroup(ingredientList.groupMains, 0).trigger('dragstart')
      burgerConstructor.dropContainer.trigger('drop')

      burgerConstructor.btnOrderCreation.click()

      cy.wait('@orderCreation')
      cy.waitUntil(() => modal.element)

      modal.element.should('exist').should('exist').should('be.visible').should('not.be.empty')

      cy.get('body').trigger('keydown', { keyCode: 27 })

      modal.element.should('not.exist')
    })
  })
})
