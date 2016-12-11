'use strict'

const validateToken = require('../validate-token')

/**
 * getUserByToken retrieves the User info from the DB related to an access
 * token.
 * @param  {Object} notifyStore Notify Store instance being used.
 * @param  {String|Object} token   Access Token.
 * @param  {Number}        maxAge  The lifetime of an access token.
 * @return {Promise}               Resolved when a user is found linked to a
 *                                 valid access token. Rejected otherwise.
 */
module.exports = (notifyStore, token, maxAge) => {
  let resolvedTokenPromise = (typeof token == 'string')
    ? retrieveToken(notifyStore, token)
    : Promise.resolve(token)

  return resolvedTokenPromise
    .then(token => {
      return validateToken(token, maxAge)
    })
    .then(() => {
      return notifyStore.store.find(notifyStore.types.USERS, token.user)
    })
    .catch(() => {
      return notifyStore.store.delete(notifyStore.types.TOKENS, token.id)
        .then(() => Promise.reject())
    })
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
