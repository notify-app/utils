'use strict'

const assert = require('assert')
const utils = require('../index')

describe('utils.getTokenFromRequest() method:', function () {
  describe('Scenario: Retrieving the token value from an HTTP Request:', function () {
    describe('Given an HTTP Request', function () {
      let req = null

      beforeEach(function () {
        req = {}
      })

      describe('with the token value stored as a cookie,', function () {
        let tokenValue = null

        beforeEach(function () {
          tokenValue = 'abc123'

          req.headers = {
            cookie: `token=${tokenValue}`
          }
        })

        describe('when trying to retrieve the token from the request:', function () {
          let tokenRetrieved = null

          beforeEach(function () {
            return utils.getTokenFromRequest(req.headers, {
              cookie: 'token',
              header: 'token'
            }).then((value) => { tokenRetrieved = value })
          })

          it('should retrieve the token value stored as a cookie', function () {
            assert.strictEqual(tokenRetrieved, tokenValue)
          })
        })
      })

      describe('with the token value stored as a header,', function () {
        let tokenValue = null

        beforeEach(function () {
          tokenValue = 'abc123'

          req.headers = {
            token: tokenValue
          }
        })

        describe('when trying to retrieve the token from the request:', function () {
          let tokenRetrieved = null

          beforeEach(function () {
            return utils.getTokenFromRequest(req.headers, {
              cookie: 'token',
              header: 'token'
            }).then((value) => { tokenRetrieved = value })
          })

          it('should retrieve the token value stored as a header', function () {
            assert.strictEqual(tokenRetrieved, tokenValue)
          })
        })
      })

      describe('when the token value stored as a cookie & header,', function () {
        let cookieTokenValue = null
        let headerTokenValue = null

        beforeEach(function () {
          cookieTokenValue = 'abc123'
          headerTokenValue = 'def456'

          req.headers = {
            'header-token': headerTokenValue,
            cookie: `cookie-token=${cookieTokenValue}`
          }
        })

        describe('when trying to retrieve the token from the request:', function () {
          let tokenRetrieved = null

          beforeEach(function () {
            return utils.getTokenFromRequest(req.headers, {
              cookie: 'cookie-token',
              header: 'header-token'
            }).then((value) => { tokenRetrieved = value })
          })

          it('should retrieve the token value stored as a cookie', function () {
            assert.strictEqual(tokenRetrieved, cookieTokenValue)
          })
        })
      })
    })
  })

  describe('Scenario: Retrieving a token value of an HTTP Request which has no token:', function () {
    describe('Given an HTTP Request,', function () {
      let req = null

      beforeEach(function () {
        req = { headers: {} }
      })

      describe('with no token,', function () {
        describe('when trying to retrieve the token from the request:', function () {
          it('should return a rejected promise with an error', function (done) {
            utils.getTokenFromRequest(req.headers, {
              cookie: 'token',
              header: 'token'
            }).then(() => done('Expected a rejected promise')).catch(err => {
              assert.strictEqual(err instanceof Error, true)
              assert.strictEqual(err.message, 'token not found')
              done()
            }).catch(done)
          })
        })
      })
    })
  })
})
