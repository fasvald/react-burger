/* eslint-disable @typescript-eslint/triple-slash-reference */

// @ts-check
/// <reference path="../global.d.ts" />

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args)
})

Cypress.Commands.add('getBySelLike', (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args)
})
