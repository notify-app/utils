'use strict'

const qs = require('querystring')

/**
 * getCookieValue retrieves the value of a cookie.
 * @param  {String} cookieHeader String listing all the available cookies.
 * @param  {String} name         The name of the cookie to retrieve its value
 * @return {Promise}             Resolved with the value of the cookie. Rejected
 *                               if specified cookie is not found.
 */
module.exports = (cookieHeader, name) => {
  const cookies = qs.parse(cookieHeader, '; ', '=')
  const token = cookies[name]
  if (token === undefined) return Promise.reject()
  return Promise.resolve(token)
}
