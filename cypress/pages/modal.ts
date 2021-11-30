class Modal {
  get element() {
    return cy.getBySel('modal-dialog')
  }

  get backdrop() {
    return this.element.getBySel('modal-dialog__backdrop')
  }

  get container() {
    return this.element.getBySel('modal-dialog__container')
  }

  get containerBody() {
    return this.element.getBySel('modal-dialog__container-body')
  }

  get closeBtn() {
    return this.element.getBySel('modal-dialog__container-body-close-btn')
  }
}

export default Modal
