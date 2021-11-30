/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Yields elements with a data-test attribute that "match" a specified selector
     */
    getBySel(dataTestAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>

    /**
     * Yields elements with a data-test attribute that "contains" a specified selector
     */
    getBySelLike(dataTestPrefixAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>

    /**
     * Auth login operation by visiting login page and filling the form, etc.
     *
     * @param email User email
     * @param password User password
     */
    login(email: string, password: string): void
  }
}
