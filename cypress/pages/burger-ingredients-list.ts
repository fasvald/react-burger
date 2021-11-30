class BurgerIngredientsList {
  get element() {
    return cy.getBySel('burger-ingredient-list')
  }

  get elementSelector() {
    return '[data-test="burger-ingredient-list"]'
  }

  get tabs() {
    return cy.getBySel('burger-ingredient-list__tabs')
  }

  get tabBun() {
    return cy.getBySel('burger-ingredient-list__tabs').find('a[href="#ingredients-buns"]')
  }

  get tabSauce() {
    return cy.getBySel('burger-ingredient-list__tabs').find('a[href="#ingredients-sauces"]')
  }

  get tabMain() {
    return cy.getBySel('burger-ingredient-list__tabs').find('a[href="#ingredients-mains"]')
  }

  get groupBuns() {
    return this.element.get('#ingredients-buns')
  }

  get groupSauces() {
    return this.element.get('#ingredients-sauces')
  }

  get groupMains() {
    return this.element.get('#ingredients-mains')
  }

  getCardFromGroup(group: Cypress.Chainable<JQuery<HTMLElement>>, nth: number) {
    return group.find('[data-test="burger-ingredient-card"]').eq(nth)
  }
}

export default BurgerIngredientsList
