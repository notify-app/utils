'use strict'

/**
 * @module notify-utils/get-user-by-token
 * @private
 */

/**
 * Function used to retrieve the Access Token's owner info (user object). This
 * function can be invoked either using an Access Token object, or a token
 * value. Note that if the Access Token is invalid, it is removed from the DB.
 * @param  {String|Object} token   Access Token value / object.
 * @param  {Object} notifyStore    Notify Store instance to be used to query the
 *                                 DB.
 * @param  {Object} options        Contains info to be used for the validation
 *                                 of the affected Access Token.
 * @param  {Number} options.maxAge The `max-age` for the Access Token cookies.
 * @param  {String} options.origin The origin that the Access Token should have.
 * @return {Promise}               When Access Token is valid & the retrieval of
 *                                 its owner info (user object) is successful,
 *                                 it will return a resolved promise with the
 *                                 Access Token's owner info.
 * @return {Promise}               When Access Token is invalid or the retrieval
 *                                 of its owner info (user object) is not
 *                                 successful, it will return a rejected promise
 *                                 with an error.
 */
module.exports = function getUserByToken (token, notifyStore, options) {
  /**
   * Promise resolved with the Access Object.
   * @type {Promise}
   */
  const resolvedTokenPromise = (typeof token === 'string')
    ? retrieveToken(token, notifyStore)
    : Promise.resolve(token)

  return resolvedTokenPromise
    .then(token => validateToken.call(this, token, notifyStore, options))
    .then(token => retrieveUser(token, notifyStore))
}

/**
 * Function meant to be used when the user provides an Access Token value
 * instead of an Access Token object.
 * @param  {String} token       Access Token.
 * @param  {Object} notifyStore Notify Store instance to be used to query for
 *                              the Access Token object.
 * @return {Promise}            When an Access Token with the value specified is
 *                              found in the DB, it will return a resolved
 *                              promise with the Access Token object.
 * @return {Promise}            When an Access Token with the value specified is
 *                              not found in the DB, it will return a rejected
 *                              promise with an error.
 */
function retrieveToken (token, notifyStore) {
  // Retrieve Access Token object using the token value.
  return notifyStore.store.find(notifyStore.types.TOKENS, undefined, {
    match: { token }
  }).then(({payload}) => {
    // Return Access Token whose value is the same as the one specified.
    if (payload.count === 1) return payload.records[0]

    // Return a rejected promise if Access Token is not found.
    return Promise.reject(new Error('token not found'))
  })
}

/**
 * Function used to validate the Access Token object.
 * @this   {module:notify-utils}
 * @param  {Object} token          Access Token.
 * @param  {Object} notifyStore    Notify Store instance to be used for the
 *                                 deletion of the Access Token object from the
 *                                 DB if it is found to be invalid.
 * @param  {Object} options        Contains info to be used for the validation
 *                                 of the affected Access Token.
 * @param  {Number} options.maxAge The `max-age` for the Access Token cookies.
 * @param  {String} options.origin The origin that the Access Token should have.
 * @return {Promise}               When the Access Token is valid, it will
 *                                 return a resolved promise with the Access
 *                                 Token object.
 * @return {Promise}               When the Access Token is invalid, it will
 *                                 delete the Access Token from the DB & return
 *                                 a rejected promise with an error.
 */
function validateToken (token, notifyStore, options) {
  return this.validateToken(token, options).catch(() => {
    // If Access Token is not valid, remove it from the DB.
    return notifyStore.store.delete(notifyStore.types.TOKENS, token.id)
      .then(() => Promise.reject(new Error('invalid token removed')))
  })
}

/**
 * Function used to retrieve the owner info (user object) of the Access Token.
 * @param  {Object} token          Access Token.
 * @param  {Object} notifyStore    Notify Store instance to be used to query
 *                                 the DB for the Access Token's owner info
 *                                 (user object).
 * @return {Promise}               When the owner info of the Access Token is
 *                                 found in the DB, it will return a resolved
 *                                 promise with the owner info.
 * @return {Promise}               When the owner info of the Access Token is
 *                                 not found in the DB, it will return a
 *                                 rejected promise with an error.
 */
function retrieveUser (token, notifyStore) {
  // Query the DB for the Access Token's owner info.
  return notifyStore.store.find(notifyStore.types.USERS, token.user)
    .then(({payload}) => {
      // Return the Access Token owner info if it is found.
      if (payload.count === 1) return payload.records[0]

      // Return a rejected promise with an Error if Access Token owner info is
      // not found.
      return Promise.reject(new Error('user not found'))
    })
}
