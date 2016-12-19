'use strict'

const validateToken = require('./src/validate-token')
const getCookieValue = require('./src/get-cookie-value')
const getUserByToken = require('./src/get-user-by-token')
const getTokenFromRequest = require('./src/get-token-from-request')

module.exports = {
  validateToken,
  getCookieValue,
  getUserByToken,
  getTokenFromRequest
}
