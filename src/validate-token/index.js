'use strict'

/**
 * validateToken validates the specified access token.
 * @param  {String} token       Access Token.
 * @param  {Number} maxAge      The lifetime of an access token.
 * @return {Promise}            Resolved if token is still valid, rejected
 *                              otherwise.
 */
module.exports = (token, maxAge) => {
  const created = new Date(token.created)
  let expire = new Date(token.created)
  expire.setSeconds(expire.getSeconds() + maxAge)
  return (expire > created) ? Promise.resolve(token) : Promise.reject(token)
}
