const BROWSER_LOCK_SCROLL_CLASS = 'modal-is-opened'

/**
 * Set special class to body to indicate the browser to lock the scroll possibility during opened modal
 */
export function disableBrowserBodyScroll(): void {
  document.body.classList.add(BROWSER_LOCK_SCROLL_CLASS)
}

/**
 * Unset special class to body to indicate the browser to lock the scroll possibility during opened modal
 */
export function enableBrowserBodyScroll(): void {
  document.body.classList.remove(BROWSER_LOCK_SCROLL_CLASS)
}

/**
 * Create element for future modal injection (or return a link to already created one)
 *
 * @param rootEl Modal root HTML element
 * @returns Newly created element or return link to already created one
 */
export function createInjectionElement(rootEl: HTMLElement | null): HTMLDivElement {
  return rootEl?.childElementCount
    ? (rootEl.childNodes[0] as HTMLDivElement)
    : document.createElement('div')
}
