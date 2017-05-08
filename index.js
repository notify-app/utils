'use strict'

module.exports = {
  validateToken: require('./src/validate-token'),
  getCookieValue: require('./src/get-cookie-value'),
  getUserByToken: require('./src/get-user-by-token'),
  getTokenFromRequest: require('./src/get-token-from-request')
}
