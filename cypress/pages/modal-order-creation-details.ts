class ModalOrderCreationDetails {
  get element() {
    return cy.getBySel('modal-order-creation')
  }

  get orderNumber() {
    return this.element.getBySel('modal-order-creation__number')
  }
}

export default ModalOrderCreationDetails
