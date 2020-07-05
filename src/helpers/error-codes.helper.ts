export const CODES: any = {
  'email_already_exists': 'Email is not available',
  'invalid_email_password': 'Invalid Email/password',
}

/**
 * Find error by code or objects error
 * 
 * @param errorCode
 * @param objects
 */
export const getErrorCode = (errorCode: string, objects = []): string => {
  let error = errorCode
  const codes = Object.keys(CODES)

  if (typeof objects === 'object') {
    objects.forEach((objError: string) => {
      const split = objError.split('.')
      const err = split.length ===  0 ? errorCode.replace('object', objError) : errorCode.replace('object', split[0])

      if (codes.includes(err)) {
        error = err
      }
    })
  }

  return CODES[error] || error
}
