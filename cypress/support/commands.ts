/* eslint-disable @typescript-eslint/triple-slash-reference */

import LoginPage from '../pages/login-page'

// @ts-check
/// <reference path="../global.d.ts" />

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args)
})

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args)
})

// https://www.cypress.io/blog/2021/08/04/authenticate-faster-in-tests-cy-session-command/
Cypress.Commands.add('login', (email: string, password: string) => {
  const loginPage = new LoginPage()

  loginPage.visit()
  loginPage.fillEmail(email)
  loginPage.fillPassword(password)
  loginPage.signInBtn.click()
})
