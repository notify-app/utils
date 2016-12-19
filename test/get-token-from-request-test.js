'use strict'

const assert = require('assert')
const utils = require('../index')

describe('utils.getTokenFromRequest() method:', function () {
  describe('Scenario: Retrieving the token value from an HTTP Request:', function () {
    describe('Given an HTTP Request:', function () {
      let req = null

      beforeEach(function () {
        req = {}
      })

      describe('having the token value stored as a cookie,', function () {
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

      describe('having the token value stored as a header,', function () {
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
    })
  })

  describe('Scenario: Retrieving a token value of an HTTP Request which has no token:', function () {
    describe('Given an HTTP Request,', function () {
      let req = null

      beforeEach(function () {
        req = {
          headers: {}
        }
      })

      describe('with no token,', function () {
        describe('when trying to retrieve the token from the request:', function () {
          it('should return a rejected promise', function (done) {
            utils.getTokenFromRequest(req.headers, {
              cookie: 'token',
              header: 'token'
            })
            .catch(() => done())
          })
        })
      })
    })
  })
})
