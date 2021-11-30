class BurgerIngredients {
  get element() {
    return cy.getBySel('burger-ingredient')
  }

  get header() {
    return this.element.get('h1')
  }
}

export default BurgerIngredients
