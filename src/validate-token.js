'use strict'

/**
 * @module notify-utils/validate-token
 * @private
 */

/**
 * Function used to validate an Access Token. A token is considered to be valid
 * if it meets the following criteria:
 *   - Token is not older than the `max-age` used for the Access Token cookies
 *     (this check will be done only when `options.maxAge` is provided).
 *   - Token's origin is the same as the one provided (this check will be done
 *     only when `options.origin` is provided).
 *
 * @example
 * <caption>Validating a valid token</caption>
 * const utils = require('notify-utils')
 *
 * // Access Token to be validated.
 * const token = {
 *   origin = 'http://foo.io'
 * }
 *
 * // Expected origin. Note that it is not the same as the `token`'s origin.
 * const expectedOrigin = 'http://foo.io'
 *
 * // When validating the token object it should return a rejected promise.
 * utils.validateToken(token, { origin: expectedOrigin }).then(token => {
 *   console.log(token) // prints token.
 * })
 *
 * @example
 * <caption>Validating a token with an invalid origin</caption>
 * const utils = require('notify-utils')
 *
 * // Access Token to be validated.
 * const token = {
 *   origin = 'http://foo.io'
 * }
 *
 * // Expected origin. Note that it is not the same as the `token`'s origin.
 * const expectedOrigin = 'http://bar.io'
 *
 * // When validating the token object it should return a rejected promise.
 * utils.validateToken(token, { origin: expectedOrigin }).catch(token => {
 *   console.log(token) // prints token.
 * })
 *
 * @example
 * <caption>Validating an expired token</caption>
 * const utils = require('notify-utils')
 *
 * // Access Token to be validated.
 * const token = {
 *   created: new Date(2017, 0, 1, 12, 30) // Year, Month, Day, Hours, Minutes.
 * }
 *
 * // Cookie `max-age` === 1 hour.
 * const cookieMaxAge = 3600
 *
 * // Todays Date. 2 Hours in the future of the Access Token `created` date.
 * const todaysDate = new Date(2017, 0, 1, 14, 30)
 *
 * // When validating the token object it should return a rejected promise.
 * utils.validateToken(token, { maxAge: cookieMaxAge }).catch(token => {
 *   console.log(token) // prints token.
 * })
 *
 * @param  {Object} token          Access Token to be validated.
 * @param  {Object} options        Contains info to be used for the validation
 *                                 of the provided Access Token.
 * @param  {Number} options.maxAge The `max-age` for the Access Token cookies.
 * @param  {String} options.origin The origin that the Access Token should have.
 * @return {Promise}               When the Access Token is valid, it will
 *                                 return a resolved promise with the token
 *                                 object.
 * @return {Promise}               When Access Token is not valid, it will
 *                                 return a rejected promise with the token
 *                                 object.
 */
module.exports = function validateToken (token, { maxAge, origin }) {
  /**
   * Determines whether the Access Token is expired.
   * @type {Boolean}
   */
  const validExpiry = validateExpiry(token, maxAge)

  /**
   * Determines whether the Access Token's origin is the same as the one
   * specified.
   * @type {Boolean}
   */
  const validOrigin = validateOrigin(token, origin)

  // If Access Token is valid return a resolved promise with the token object,
  // else return a rejected promise with the token object.
  return (validExpiry && validOrigin)
    ? Promise.resolve(token)
    : Promise.reject(token)
}

/**
 * Function used to determine whether the token is expired. An Access Token will
 * be considered as expired if its age is older than the `max-age` used for the
 * Access Token cookies.
 * @param  {Object} token  Access Token to be validated.
 * @param  {Number} maxAge The `max-age` for Access Token cookies.
 * @return {Boolean}       TRUE if not expired, FALSE otherwise.
 */
function validateExpiry (token, maxAge) {
  // Token should be considered as not expired if no max-age is specified.
  if (maxAge == null) return true

  /**
   * Date that the token should be considered as expired.
   * @type {Date}
   */
  const expire = new Date(token.created)
  expire.setSeconds(expire.getSeconds() + maxAge)

  // If Todays Date is in the future of the expired date, it means that the
  // token has not yet been expired, else it means that it has.
  return (expire > new Date())
}

/**
 * Function used to determine whether the token's origin is valid. An Access
 * Token origin would be considered to be invalid if it is not the same as the
 * one specified.
 * @param  {Object} token  Access Token to be validated.
 * @param  {String} opts.origin  The origin of the HTTP request.
 * @return {Boolean}             TRUE if origin is valid, FALSE otherwise.
 */
function validateOrigin (token, origin) {
  // Token's origin should be considered as valid if no origin is specified.
  if (origin == null) return true

  // Token should be considered as valid if its origin is the same as the one
  // specified.
  return token.origin === origin
}
