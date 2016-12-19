'use strict'

/**
 * getTokenFromRequest retrieves the token value from an HTTP Request. Access
 * Tokens in Notify, can be stored either as a cookie (for logged in users) or
 * as an HTTP Header (mainly for bots). This function is used to retrieve the
 * token from one of these places. If no token is found, it will return a
 * rejected promise.
 *
 * @this   Utils
 * @param  {Object} headers        HTTP request headers.
 * @param  {String} options.cookie The name of the cookie containing the access
 *                                 token.
 * @param  {String} options.header The name of the header containing the access
 *                                 token.
 * @return {Promise}               Resolved when the token value had been
 *                                 retrieved, rejected otherwise.
 */
module.exports = function (headers, { cookie, header }) {
  return this.getCookieValue(headers.cookie, cookie)
    .catch(() => parseHeader(headers, header))
}

/**
 * parseHeader searches for the access token from the HTTP Request Headers.
 * @param  {Object} headers HTTP request headers.
 * @return {Promise}        Resolved with the token value when the HTTP Header
 *                          name exists (i.e. token exists). Rejected otherwise.
 */
function parseHeader (headers, header) {
  const token = headers[header]
  return (token !== undefined)
    ? Promise.resolve(token)
    : Promise.reject('token not found')
}
