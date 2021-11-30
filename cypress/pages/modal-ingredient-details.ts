class ModalIngredientDetails {
  get element() {
    return cy.getBySel('modal-ingredient-details')
  }

  get image() {
    return this.element.getBySel('modal-ingredient-details-img')
  }

  get name() {
    return this.element.getBySel('modal-ingredient-details__body-name')
  }

  get foodEnergy() {
    return this.element.getBySel('modal-ingredient-details-food-energy')
  }
}

export default ModalIngredientDetails
