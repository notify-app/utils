'use strict'

const getCookieValue = require('../get-cookie-value')

/**
 * getTokenFromRequest retrieves the token value from the request i.e. either
 * as a cookie or a HTTP Header.
 * @param  {Object} headers        HTTP request headers.
 * @param  {String} options.cookie The name of the cookie containing the access
 *                                 token.
 * @param  {String} options.header The name of the header containing the access
 *                                 token.
 * @return {Promise}               Resolved when the token value had been
 *                                 retrieved, rejected otherwise.
 */
module.exports = (headers, { cookie, header }) => {
  return getCookieValue(headers.cookie, cookie)
    .catch(err => {
      return parseHeader(headers, header)
    })
}

/**
 * parseHeader parses the HTTP Request header to retrieve the Access Token of
 * the logged in user.
 * @param  {Object} headers HTTP request headers.
 * @return {Promise}        Resolved when the user is logged in and the
 *                          Access Token is retrieved. Rejected
 *                          otherwise.
 */
function parseHeader (headers, header) {
  const token = headers[header]
  return (token !== undefined) ? Promise.resolve(token) : Promise.reject()
}
