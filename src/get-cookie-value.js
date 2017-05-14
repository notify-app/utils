'use strict'

/**
 * @module notify-utils/get-cookie-value
 * @private
 */

const qs = require('querystring')

/**
 * Function used to retrieve the value of a cookie from a cookie string.
 *
 * @example
 * const utils = require('notify-utils')
 *
 * // Cookie String
 * const cookieString = 'name=luca; surname=tabone; age=23'
 *
 * // Retrieve the value of an existing cookie.
 * utils.getCookieString(cookieString, 'name').then(val => {
 *   console.log(val) // prints 'luca'.
 * })
 *
 * // Retrieve the value of a non-existing cookie.
 * utils.getCookieString(cookieString, 'non-existing').catch(err => {
 *   console.log(err) // prints error.
 * })
 *
 * @param  {String} cookieString Cookie string that will be parsed to retrieve
 *                               the value of a cookie.
 * @param  {String} name         Name of the cookie.
 * @return {Promise}             When the cookie exist in the provided cookie
 *                               string, it will return a resolved promise with
 *                               the value of the specified cookie.
 * @return {Promise}             When cookie does not exist in the provided
 *                               cookie string, it will return a rejected
 *                               promise.
 */
module.exports = function getCookieValue (cookieString, name) {
  // Parse cookie string.
  const cookies = qs.parse(cookieString, '; ', '=')

  // Retrieve value of specified cookie.
  const value = cookies[name]

  // If specified cookie does not exist, return a rejected promise.
  if (value === undefined) return Promise.reject(new Error('cookie not found'))

  // If specified cookie exist, return a resolved promise with the value of the
  // specified cookie.
  return Promise.resolve(value)
}
