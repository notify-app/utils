'use strict'

/**
 * This module contains common utilities that are used throughout the Notify
 * project.
 * @module notify-utils
 * @borrows module:notify-utils/validate-token as validateToken
 * @borrows module:notify-utils/get-cookie-value as getCookieValue
 * @borrows module:notify-utils/get-user-by-token as getUserByToken
 * @borrows module:notify-utils/get-token-from-request as getTokenFromRequest
 */
module.exports = {
  validateToken: require('./src/validate-token'),
  getCookieValue: require('./src/get-cookie-value'),
  getUserByToken: require('./src/get-user-by-token'),
  getTokenFromRequest: require('./src/get-token-from-request')
}
