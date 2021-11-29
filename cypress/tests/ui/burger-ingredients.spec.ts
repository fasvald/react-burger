import BurgerIngredients from '@pages/burger-ingredients'

describe('Burger Ingredients Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('should show list with groups of ingredients', () => {
    const burgerIngredients = new BurgerIngredients()

    const { element } = burgerIngredients
  })
})
