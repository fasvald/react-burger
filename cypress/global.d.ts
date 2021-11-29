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
  }
}
