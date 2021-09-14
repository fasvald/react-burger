const BROWSER_LOCK_SCROLL_CLASS = 'modal-is-opened'

/**
 * Set special class to body to indicate the browser to lock the scroll possibility during opened modal
 */
export function blockBrowserScroll(): void {
  document.body.classList.add(BROWSER_LOCK_SCROLL_CLASS)
}

/**
 * Unset special class to body to indicate the browser to lock the scroll possibility during opened modal
 */
export function unblockBrowserScroll(): void {
  document.body.classList.remove(BROWSER_LOCK_SCROLL_CLASS)
}
