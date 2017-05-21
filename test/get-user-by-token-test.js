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
   * maxAge is the 'max-age' used in Access Token cookies.
   * @type {Number}
   */
  let maxAge = null

  /**
   * origin of the Access Token.
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
    token = { id: '1', user: user.id }
    maxAge = 3600 // 1 hour
    origin = 'http://foo.com'

    notifyStore = {
      types: {
        USERS: 'users',
        TOKENS: 'tokens'
      },
      store: {
        find: sinon.stub(),
        delete: sinon.stub().resolves()
      }
    }

    notifyStore.store.find.callsFake(type => {
      const resp = {
        payload: {
          count: 1,
          records: null
        }
      }

      if (type === notifyStore.types.USERS) resp.payload.records = [ user ]
      if (type === notifyStore.types.TOKENS) resp.payload.records = [ token ]

      return Promise.resolve(resp)
    })
  })

  describe('Scenario: Retrieving the user by token value (i.e. string):', function () {
    describe('Given a token value,', function () {
      let tokenValue = null

      beforeEach(function () {
        tokenValue = 'abc123'
      })

      describe('which is considered to be valid,', function () {
        beforeEach(function () {
          sinon.stub(utils, 'validateToken').resolves(token)
        })

        afterEach(function () {
          utils.validateToken.restore()
        })

        describe('when retrieving the user which the token belongs to:', function () {
          let respUser = null

          beforeEach(function () {
            return utils.getUserByToken(tokenValue, notifyStore, {
              maxAge, origin
            }).then(resp => { respUser = resp })
          })

          it('should query the db twice (user & token)', function () {
            assert.strictEqual(notifyStore.store.find.callCount, 2)
          })

          it('should retrieve the token object', function () {
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

          it('should retrieve the user', function () {
            assert.strictEqual(
              notifyStore.store.find.getCall(1).args[0],
              notifyStore.types.USERS)

            assert.strictEqual(
              notifyStore.store.find.getCall(1).args[1],
              token.user)

            assert.strictEqual(user, respUser)
          })
        })
      })

      describe('which is considered to be invalid,', function () {
        beforeEach(function () {
          sinon.stub(utils, 'validateToken').rejects(new Error('invalid token'))
        })

        afterEach(function () {
          utils.validateToken.restore()
        })

        describe('when retrieving the user which the token belongs to:', function () {
          it('should query the db once (token)', function (done) {
            utils.getUserByToken(tokenValue, notifyStore, {
              maxAge, origin
            }).then(() => done('Expected a rejected promise')).catch(() => {
              assert.strictEqual(notifyStore.store.find.callCount, 1)
              done()
            }).catch(done)
          })

          it('should retrieve the token object', function (done) {
            utils.getUserByToken(tokenValue, notifyStore, {
              maxAge, origin
            }).then(() => done('Expected a rejected promise')).catch(() => {
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
            }).catch(done)
          })

          it('should delete the token from db', function (done) {
            utils.getUserByToken(tokenValue, notifyStore, {
              maxAge, origin
            }).then(() => done('Expected a rejected promise')).catch(() => {
              assert.strictEqual(notifyStore.store.delete.callCount, 1)

              assert.strictEqual(
                notifyStore.store.delete.getCall(0).args[0],
                notifyStore.types.TOKENS)

              assert.strictEqual(
                notifyStore.store.delete.getCall(0).args[1],
                token.id)

              done()
            }).catch(done)
          })

          it('should return a rejected promise with an error', function (done) {
            utils.getUserByToken(tokenValue, notifyStore, { maxAge, origin })
              .then(() => done('Expected a rejected promise')).catch(err => {
                assert.strictEqual(err instanceof Error, true)
                assert.strictEqual(err.message, 'invalid token removed')
                done()
              }).catch(done)
          })
        })
      })
    })
  })

  describe('Scenario: Retrieving the user by token object:', function () {
    describe('Given a token object,', function () {
      describe('which is considered to be valid,', function () {
        beforeEach(function () {
          sinon.stub(utils, 'validateToken').resolves(token)
        })

        afterEach(function () {
          utils.validateToken.restore()
        })

        describe('when retrieving the user which the token belongs to:', function () {
          let respUser = null

          beforeEach(function () {
            return utils.getUserByToken(token, notifyStore, { maxAge, origin })
              .then(resp => { respUser = resp })
          })

          it('should only query the db for the user', function () {
            assert.strictEqual(notifyStore.store.find.callCount, 1)

            assert.strictEqual(
              notifyStore.store.find.getCall(0).args[0],
              notifyStore.types.USERS)

            assert.strictEqual(
              notifyStore.store.find.getCall(0).args[1],
              token.user)

            assert.strictEqual(respUser, user)
          })
        })
      })

      describe('which is considered to be invalid,', function () {
        beforeEach(function () {
          sinon.stub(utils, 'validateToken').rejects(token)
        })

        afterEach(function () {
          utils.validateToken.restore()
        })

        describe('when retrieving the user which the token belongs to:', function () {
          it('should not query the db', function (done) {
            utils.getUserByToken(token, notifyStore, { maxAge, origin })
              .then(() => done('Expected a rejected promise')).catch(() => {
                assert.strictEqual(notifyStore.store.find.callCount, 0)
                done()
              }).catch(done)
          })

          it('should delete the token from db', function (done) {
            utils.getUserByToken(token, notifyStore, { maxAge, origin })
              .then(() => done('Expected a rejected promise')).catch(() => {
                assert.strictEqual(notifyStore.store.delete.callCount, 1)

                assert.strictEqual(
                  notifyStore.store.delete.getCall(0).args[0],
                  notifyStore.types.TOKENS)

                assert.strictEqual(
                  notifyStore.store.delete.getCall(0).args[1],
                  token.id)

                done()
              }).catch(done)
          })

          it('should return a rejected promise', function (done) {
            utils.getUserByToken(token, notifyStore, { maxAge, origin })
              .then(() => done('Expected a rejected promise')).catch(err => {
                assert.strictEqual(err instanceof Error, true)
                assert.strictEqual(err.message, 'invalid token removed')
                done()
              }).catch(done)
          })
        })
      })
    })
  })
})
