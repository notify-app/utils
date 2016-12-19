'use strict'

/**
 * validateToken checks whether the token object is valid. A token is considered
 * to be valid if it meets the following criteria:
 *   * Token is not expired (if max-age is provided).
 *   * Token's origin is the same as the origin provided
 *     (if origin is provided).
 * @this   Utils
 * @param  {Object} token        Token object.
 * @param  {Number} opts.maxAge  The lifetime of an access token.
 * @param  {String} opts.origin  The origin of the request.
 * @return {Promise}             Resolved if token is valid, rejected otherwise.
 */
module.exports = function (token, {maxAge, origin}) {
  const validExpiry = validateExpiry(token, maxAge)
  const validOrigin = validateOrigin(token, origin)

  return (validExpiry && validOrigin)
    ? Promise.resolve(token)
    : Promise.reject(token)
}

/**
 * validateExpiry verifies whether the token has expired or not.
 * @param  {Object} token       Access Token.
 * @param  {Number} maxAge      The lifetime of an access token.
 * @return {Boolean}            TRUE if is not expired, FALSE otherwise.
 */
function validateExpiry (token, maxAge) {
  if (maxAge == null) return true
  const created = new Date(token.created)
  let expire = new Date(token.created)
  expire.setSeconds(expire.getSeconds() + maxAge)
  return (expire > created)
}

/**
 * validateOrigin verifies whether the origin of the request is valid with the
 * token origin or not.
 * @param  {Object} token        Access Token.
 * @param  {String} opts.origin  The origin of the request.
 * @return {Boolean}             TRUE if origin is valid, FALSE otherwise.
 */
function validateOrigin (token, origin) {
  if (origin == null) return true
  return token.origin === origin
}
