'use strict'

const qs = require('querystring')

/**
 * getCookieValue is used to return the value of a cookie in a given cookie
 * string. If the cookie specified does not exists in the provided cookie string
 * it will return a rejected promise.
 *
 * Lets assume we have the following cookie string: `name=luca; surname=tabone;
 * age=23`. We can use this function to retrieve the value of the `surname`
 * cookie as follows:
 *
 * @example
 * const cookieString = 'name=luca; surname=tabone; age=23'
 * getCookieValue(cookieString, 'surname')
 *   .then(cookieValue => console.log(cookieValue)) // cookieValue === 'tabone'
 *
 * As documented, if we try to retrieve the value of a non-existent cookie, it
 * will return a rejected promise.
 *
 * @example
 * const cookieString = 'name=luca; surname=tabone; age=23'
 * getCookieValue(cookieString, 'non-existent-cookie')
 *   .catch((err) => console.log(err)) // err.message === 'cookie not found'
 *
 * @this   Utils
 * @param  {String} cookieString String listing all the available cookies.
 * @param  {String} name         The name of the cookie.
 * @return {Promise}             Resolved with the value of the cookie. Rejected
 *                               if specified cookie is not found.
 */
module.exports = function (cookieString, name) {
  const cookies = qs.parse(cookieString, '; ', '=')
  const token = cookies[name]
  if (token === undefined) return Promise.reject(new Error('cookie not found'))
  return Promise.resolve(token)
}
