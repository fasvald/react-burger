class BurgerConstructor {
  get element() {
    return cy.getBySel('burger-constructor')
  }

  get dropContainer() {
    return this.element.getBySel('burger-constructor-drop-container')
  }

  get dropContainerSelector() {
    return '[data-test="burger-constructor-drop-container"]'
  }

  get dropContainerToppings() {
    return this.element.getBySel('burger-constructor-drop-container__toppings')
  }

  get bunsIngredients() {
    return this.dropContainer.getBySel('burger-constructor-ingredient-bun')
  }

  get toppingsIngredients() {
    return this.dropContainer.getBySel('burger-constructor-ingredient-dnd')
  }

  get droppedIngredients() {
    return this.dropContainer.getBySelLike('burger-constructor-ingredient-')
  }

  get orderCreationSection() {
    return this.element.getBySel('order-creation-section')
  }

  get btnOrderCreation() {
    return this.element.getBySel('order-creation-section__button')
  }

  get orderCreationTotalPrice() {
    return this.element.getBySel('order-creation-section__total-price')
  }
}

export default BurgerConstructor
