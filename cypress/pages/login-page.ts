class LoginPage {
  visit() {
    cy.visit('/login')
  }

  get form() {
    return cy.getBySel('login-form')
  }

  get emailEl() {
    return this.form.getBySel('login-form__email')
  }

  get emailInput() {
    return this.emailEl.get('input[type="email"]')
  }

  get emailElBtn() {
    return this.emailEl.find('.input__icon-action')
  }

  get passwordEl() {
    return this.form.getBySel('login-form__password')
  }

  get passwordInput() {
    return this.passwordEl.get('input[type="password"]')
  }

  get signInBtn() {
    return this.form.get('button[type="submit"]')
  }

  fillEmail(email: string) {
    this.emailElBtn.click()
    this.emailInput.type(email)
  }

  fillPassword(password: string) {
    this.passwordEl.type(password)
  }
}

export default LoginPage
