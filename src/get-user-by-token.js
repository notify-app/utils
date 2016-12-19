'use strict'

/**
 * getUserByToken returns the user associated with a token. This function can
 * be invoked either with the token object itself or the token value (in which
 * case it will first retrieve the token object from the db). If the provided
 * token is not considered to valid, this function will return a rejected
 * promise.
 * @this   Utils
 * @param  {String|Object} token        Access Token.
 * @param  {Object} opts.notifyStore    Notify Store instance being used.
 * @param  {Number} opts.maxAge         The lifetime of an access token.
 * @param  {String} opts.origin         The origin of the request.
 * @return {Promise}                    Resolved when a user is found linked to
 *                                      a valid access token. Rejected
 *                                      otherwise.
 */
module.exports = function (token, { notifyStore, maxAge, origin }) {
  const resolvedTokenPromise = (typeof token === 'string')
    ? retrieveToken(notifyStore, token)
    : Promise.resolve(token)

  return resolvedTokenPromise
    .then(token => this.validateToken(token, { maxAge, origin }))
    .then(token => handleValidToken(notifyStore, token))
    .catch(token => handleInvalidToken(notifyStore, token))
}

/**
 * retrieveToken retrieves the token info from the DB.
 * @param  {Object} notifyStore Notify Store instance being used.
 * @param  {String} token       Access Token.
 * @return {Promise}            Resolved when access token is found in db.
 *                              Rejected otherwise.
 */
function retrieveToken (notifyStore, token) {
  return notifyStore.store.find(notifyStore.types.TOKENS, undefined, {
    match: { token }
  })
  .then(({payload}) => {
    if (payload.count === 0) return Promise.reject()
    return payload.records[0]
  })
}

/**
 * handleValidToken will handle the case form when the access token is valid.
 * When the token is valid it should return the user which the token belongs to.
 * @param  {Object} notifyStore    Notify Store instance being used.
 * @param  {Object} token          Access Token.
 * @return {Promise}               Resolved with the user.
 */
function handleValidToken (notifyStore, token) {
  return notifyStore.store.find(notifyStore.types.USERS, token.user)
}

/**
 * handleInvalidToken will handle the case for when the access token is invalid.
 * When the token is invalid, it should be removed from the db.
 * @param  {Object} notifyStore    Notify Store instance being used.
 * @param  {Object} token          Access Token.
 * @return {Promise}               Rejected promise.
 */
function handleInvalidToken (notifyStore, token) {
  return notifyStore.store.delete(notifyStore.types.TOKENS, token.id)
    .then(() => Promise.reject('invalid token removed'))
}
