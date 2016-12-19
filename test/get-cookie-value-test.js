'use strict'

const assert = require('assert')
const utils = require('../index')

describe('utils.getCookieValue() method:', function () {
  describe('Scenario: Retrieving a cookie value from a cookie string containing info about one cookie:', function () {
    let cookieString = null

    describe('Given a cookie string which contains info about one cookie,', function () {
      beforeEach(function () {
        cookieString = 'name=luca'
      })

      describe('when trying to retrieve the value of a cookie:', function () {
        let cookieValue = null

        beforeEach(function () {
          return utils.getCookieValue(cookieString, 'name')
            .then(value => {
              cookieValue = value
            })
        })

        it('should retrieve the value of the specified cookie', function () {
          assert.strictEqual(cookieValue, 'luca')
        })
      })
    })
  })

  describe('Scenario: Retrieving a cookie value from a cookie string containing info about multiple cookies:', function () {
    let cookieString = null

    describe('Given a cookie string which contains info about multiple cookies,', function () {
      beforeEach(function () {
        cookieString = 'name=luca; surname=tabone'
      })

      describe('when trying to retrieve the value of a cookie:', function () {
        let cookieValue = null

        beforeEach(function () {
          return utils.getCookieValue(cookieString, 'name')
            .then(value => {
              cookieValue = value
            })
        })

        it('should retrieve the value of the specified cookie', function () {
          assert.strictEqual(cookieValue, 'luca')
        })
      })
    })
  })

  describe('Scenario: Retrieving a cookie value of a non-existant cookie:', function () {
    let cookieString = null

    describe('Given a cookie string,', function () {
      beforeEach(function () {
        cookieString = 'name=luca'
      })

      describe('when trying to retrieve the value of a non-exitant cookie:', function () {
        it('should return a rejected promise', function (done) {
          utils.getCookieValue(cookieString, 'surname')
            .catch(() => done())
        })
      })
    })
  })
})
