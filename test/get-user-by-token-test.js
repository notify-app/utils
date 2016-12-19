'use strict'

const sinon = require('sinon')
const assert = require('assert')
const utils = require('../index')

describe('utils.getUserByToken() method:', function () {
  /**
   * user is a mock of the user retrieved from db which the token belongs to.
   * @type {Object}
   */
  let user = null

  /**
   * token is a mock of a token retrieved from db.
   * @type {Object}
   */
  let token = null

  /**
   * maxAge.
   * @type {Number}
   */
  let maxAge = null

  /**
   * origin.
   * @type {String}
   */
  let origin = null

  /**
   * notifyStore mock.
   * @type {Object}
   */
  let notifyStore = null

  beforeEach(function () {
    user = { id: 'a0' }
    token = { id: '1', user: 'a0' }
    maxAge = 3600 // 1 hour
    origin = 'http://foo.com'

    notifyStore = {
      types: {
        TOKENS: 'tokens',
        USERS: 'users'
      },
      store: {
        find: null,
        delete: sinon.stub()
      }
    }

    // The 'find' function can be used to either return a user or a token.
    notifyStore.store.find = (type, id, opts) => {
      const resp = {
        payload: {
          records: null
        }
      }

      if (type === notifyStore.types.TOKENS) resp.payload.records = [token]
      if (type === notifyStore.types.USERS) resp.payload.records = [user]

      return Promise.resolve(resp)
    }

    sinon.spy(notifyStore.store, 'find')
    notifyStore.store.delete.returns(Promise.resolve())
  })

  describe('Scenario: Retrieving the user by token value (i.e. string):', function () {
    describe('Given a token value,', function () {
      let tokenValue = null

      beforeEach(function () {
        tokenValue = 'abc123'
      })

      describe('which is considered to be valid,', function () {
        beforeEach(function () {
          sinon.stub(utils, 'validateToken')
            .returns(Promise.resolve(token))
        })

        afterEach(function () {
          utils.validateToken.restore()
        })

        describe('when retrieving the user which the token belongs to:', function () {
          it('should retrieve the token object', function () {
            return utils.getUserByToken(tokenValue, {
              notifyStore, maxAge, origin
            })
            .then(() => {
              assert.strictEqual(
                notifyStore.store.find.getCall(0).args[0],
                notifyStore.types.TOKENS)

              assert.strictEqual(
                notifyStore.store.find.getCall(0).args[1],
                undefined)

              assert.deepStrictEqual(
                notifyStore.store.find.getCall(0).args[2],
                { match: { token: tokenValue } })
            })
          })

          it('should retrieve the user', function () {
            return utils.getUserByToken(tokenValue, {
              notifyStore, maxAge, origin
            })
            .then(({payload}) => {
              assert.strictEqual(
                notifyStore.store.find.getCall(1).args[0],
                notifyStore.types.USERS)

              assert.strictEqual(
                notifyStore.store.find.getCall(1).args[1],
                token.user)

              assert.strictEqual(payload.records[0], user)
            })
          })
        })
      })

      describe('which is considered to be invalid,', function () {
        beforeEach(function () {
          sinon.stub(utils, 'validateToken')
            .returns(Promise.reject(token))
        })

        afterEach(function () {
          utils.validateToken.restore()
        })

        describe('when retrieving the user which the token belongs to:', function () {
          it('should retrieve the token object', function (done) {
            utils.getUserByToken(tokenValue, {
              notifyStore, maxAge, origin
            })
            .catch(() => {
              assert.strictEqual(
                notifyStore.store.find.getCall(0).args[0],
                notifyStore.types.TOKENS)

              assert.strictEqual(
                notifyStore.store.find.getCall(0).args[1],
                undefined)

              assert.deepStrictEqual(
                notifyStore.store.find.getCall(0).args[2],
                { match: { token: tokenValue } })

              done()
            })
          })

          it('should delete the token from db', function (done) {
            utils.getUserByToken(tokenValue, {
              notifyStore, maxAge, origin
            })
            .catch(() => {
              assert.strictEqual(notifyStore.store.delete.callCount, 1)

              assert.strictEqual(
                notifyStore.store.delete.getCall(0).args[0],
                notifyStore.types.TOKENS)

              assert.strictEqual(
                notifyStore.store.delete.getCall(0).args[1],
                token.id)

              done()
            })
          })

          it('should return a rejected promise', function (done) {
            utils.getUserByToken(tokenValue, {
              notifyStore, maxAge, origin
            })
            .catch(() => done())
          })
        })
      })
    })
  })

  describe('Scenario: Retrieving the user by token object:', function () {
    describe('Given a token object,', function () {
      describe('which is considered to be valid,', function () {
        beforeEach(function () {
          sinon.stub(utils, 'validateToken')
            .returns(Promise.resolve(token))
        })

        afterEach(function () {
          utils.validateToken.restore()
        })

        describe('when retrieving the user which the token belongs to:', function () {
          it('should not retrieve the token object', function () {
            return utils.getUserByToken(token, {
              notifyStore, maxAge, origin
            })
            .then(() => {
              assert.strictEqual(
                notifyStore.store.find.getCall(0).args[0],
                notifyStore.types.USERS)

              assert.strictEqual(notifyStore.store.find.callCount, 1)
            })
          })

          it('should retrieve the user', function () {
            return utils.getUserByToken(token, {
              notifyStore, maxAge, origin
            })
            .then(({payload}) => {
              assert.strictEqual(
                notifyStore.store.find.getCall(0).args[0],
                notifyStore.types.USERS)

              assert.strictEqual(
                notifyStore.store.find.getCall(0).args[1],
                token.user)

              assert.strictEqual(payload.records[0], user)
            })
          })
        })
      })

      describe('which is considered to be invalid,', function () {
        beforeEach(function () {
          sinon.stub(utils, 'validateToken')
            .returns(Promise.reject(token))
        })

        afterEach(function () {
          utils.validateToken.restore()
        })

        describe('when retrieving the user which the token belongs to:', function () {
          it('should not retrieve the token object', function (done) {
            utils.getUserByToken(token, {
              notifyStore, maxAge, origin
            })
            .catch(() => {
              assert.strictEqual(notifyStore.store.find.callCount, 0)
              done()
            })
          })

          it('should delete the token from db', function (done) {
            utils.getUserByToken(token, {
              notifyStore, maxAge, origin
            })
            .catch(() => {
              assert.strictEqual(notifyStore.store.delete.callCount, 1)

              assert.strictEqual(
                notifyStore.store.delete.getCall(0).args[0],
                notifyStore.types.TOKENS)

              assert.strictEqual(
                notifyStore.store.delete.getCall(0).args[1],
                token.id)

              done()
            })
          })

          it('should return a rejected promise', function (done) {
            utils.getUserByToken(token, {
              notifyStore, maxAge, origin
            })
            .catch(() => done())
          })
        })
      })
    })
  })
})
