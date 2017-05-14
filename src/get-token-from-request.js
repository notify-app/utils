'use strict'

/**
 * @module notify-utils/get-token-from-request
 * @private
 */

/**
 * Function used to retrieve the Access Token from an HTTP Request. Access
 * Tokens in Notify can be stored either as a cookie (for logged in users) or as
 * an HTTP Header (mainly for bots). This function will prioritise the token
 * stored as a cookie.
 *
 * @example <caption>Retrieving Access Token from cookie</caption>
 * const utils = require('notify-utils')
 *
 * // Object containing the name of the cookie & header which the Access Token
 * // is stored in.
 * const options = {
 *   header: 'header-token',
 *   cookie: 'cookie-token'
 * }
 *
 * // Access Token stored in a cookie.
 * const headers = {
 *   cookie: 'cookie-token=abc123; name=luca'
 * }
 *
 * // Retrieve Access Token.
 * utils.getTokenFromRequest(headers, options).then(val => {
 *   console.log(val) // prints 'abc123'
 * })
 *
 * @example <caption>Retrieving Access Token from header</caption>
 * const utils = require('notify-utils')
 *
 * // Object containing the name of the cookie & header which the Access Token
 * // is stored in.
 * const options = {
 *   header: 'header-token',
 *   cookie: 'cookie-token'
 * }
 *
 * // Access Token stored in a header.
 * const headers = {
 *   'header-token': 'abc123'
 * }
 *
 * // Retrieve Access Token.
 * utils.getTokenFromRequest(headers, options).then(val => {
 *   console.log(val) // prints 'abc123'
 * })
 *
 * @example
 * <caption>
 *   Retrieving Access Token from a HTTP Request that has a token stored as a
 *   cookie & header.
 * </caption>
 * const utils = require('notify-utils')
 *
 * // Object containing the name of the cookie & header which the Access Token
 * // is stored in.
 * const options = {
 *   header: 'header-token',
 *   cookie: 'cookie-token'
 * }
 *
 * // Access Token stored in a cookie & header.
 * const headers = {
 *   'header-token': 'abc123',
 *   cookie: 'cookie-token=def345'
 * }
 *
 * // Retrieve Access Token.
 * utils.getTokenFromRequest(headers, options).then(val => {
 *   console.log(val) // prints 'def345'
 * })
 *
 * @example <caption>Retrieving non-existent Access Token</caption>
 * const utils = require('notify-utils')
 *
 * // Object containing the name of the cookie & header which the Access Token
 * // is stored in.
 * const options = {
 *   header: 'header-token',
 *   cookie: 'cookie-token'
 * }}
 *
 * // Retrieve Access Token.
 * utils.getTokenFromRequest({}, options).catch(err => {
 *   console.log(err) // prints error.
 * })
 * @param  {Object} headers        Headers of an HTTP Request.
 * @param  {Object} options        Contains the name of the cookie & header
 *                                 which the Access Token is stored in.
 * @param  {String} options.name   Name of the cookie used to store the Access
 *                                 Token.
 * @param  {String} options.header Name of header used to store the Access
 *                                 Token.
 * @return {Promise}               When the Access Token is found either stored
 *                                 as a cookie or header, it will return a
 *                                 resolved promise with the token value.
 * @return {Promise}               When the Access Token is not found stored as
 *                                 a cookie or header, it will return a rejected
 *                                 promise.
 */
module.exports = function getTokenFromRequest (headers, { cookie, header }) {
  return this.getCookieValue(headers.cookie, cookie)
    .catch(() => parseHeader(headers, header))
}

/**
 * Function used to retrieve the Access Token from the HTTP Headers.
 * @param  {Object} headers HTTP request headers.
 * @return {Promise}        When the Access Token is found in the header it will
 *                          return a resolved proise with the token value. Else
 *                          it will return a rejected promise.
 */
function parseHeader (headers, header) {
  /**
   * Access Token value.
   * @type {String}
   */
  const token = headers[header]

  // If an Access Token is found, return a resolved promise with the token
  // value. Else return a rejected promise with an error.
  return (token !== undefined)
    ? Promise.resolve(token)
    : Promise.reject(new Error('token not found'))
}
