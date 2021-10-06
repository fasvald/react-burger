/**
 * Validate email on client (due to impossibility to do it using custom input elements)
 *
 * @param email Email to validate
 * @returns Validation results
 *
 * @link https://stackoverflow.com/a/46181/4606887
 */
// eslint-disable-next-line import/prefer-default-export
export const isValidEmail = (email: string): boolean => {
  const regExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return regExp.test(email.toLowerCase())
}
