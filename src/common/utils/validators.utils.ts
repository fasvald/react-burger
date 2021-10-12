/**
 * Validate email on client (due to impossibility to do it using custom input elements)
 *
 * @param email Email to validate
 * @returns Validation results
 *
 * @link https://stackoverflow.com/a/46181/4606887
 */
export const isEmailValid = (email: string): boolean => {
  const regExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return regExp.test(email.toLowerCase())
}

/**
 * Validate password on client (due to impossibility to do it using custom input elements)
 *
 * @param password Password to validate
 * @returns Validation results
 *
 * @link https://github.com/yandex-praktikum/react-developer-burger-ui-components/blob/main/src/ui/password-input.tsx
 */
export const isPasswordValid = (password: string): boolean => password.length > 6

/**
 * Validate name on client (due to impossibility to do it using custom input elements)
 *
 * @param name Name to validate
 * @returns Validation results
 *
 */
export const isNameValid = (name: string): boolean => name.length > 0

/**
 * Validate token on client (due to impossibility to do it using custom input elements)
 *
 * @param token Token to validate
 * @returns Validation results
 *
 */
export const isTokenPasswordChangeValid = (token: string): boolean => token.length > 0
