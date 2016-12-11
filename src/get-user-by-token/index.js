'use strict'

const validateToken = require('../validate-token')

/**
 * getUserByToken retrieves the User info from the DB related to an access
 * token.
 * @param  {Object} notifyStore    Notify Store instance being used.
 * @param  {String|Object} token   Access Token.
 * @param  {Number}        maxAge  The lifetime of an access token.
 * @return {Promise}               Resolved when a user is found linked to a
 *                                 valid access token. Rejected otherwise.
 */
module.exports = (notifyStore, token, maxAge) => {
  const resolvedTokenPromise = (typeof token == 'string')
    ? retrieveToken(notifyStore, token)
    : Promise.resolve(token)

  return resolvedTokenPromise
    .then(token => validateToken(token, maxAge))
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
    match: {
      token: token
    }
  }).then(({payload}) => {
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
    .then(() => Promise.reject())
}
