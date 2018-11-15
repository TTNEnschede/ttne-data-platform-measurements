'use strict'

const config    = require('./../config')
const mongoose  = require('mongoose')
const supertest = require('supertest')
const should    = require('should')
const server    = supertest.agent(config.service.base_url + ":" + config.service.port)

const testdata  = require('./test_data.js')

describe("* Measurements API test",function () {

    // Setup test environment.
    before(function (done) {
      // Before test execution
      console.log('    - Set up measurements api test environment:')

      // Connect to the database
      if (mongoose.connection.db) {
        console.log('      * Already connected.')

        mongoose.connection.db.dropCollection('Measurements')
        console.log('      * Dropped Measurements collection.')

        testdata.importData(function (err) {
          // Close connection.
          mongoose.connection.close()
          return done()
        })
      }
      mongoose.Promise = require('bluebird')
      mongoose.connect(config.db.uri, { useMongoClient: true })
      mongoose.connection.once('open', function () {
        console.log('      * Connected to test database.')

        // Add test data.
        testdata.importData(function (err) {
          // Close connection.
          mongoose.connection.close()
          return done()
        })
      })
    })

    // Teardown test environment.
    after(function (done) {
      // After test execution
      console.log('    - Tear down measurements api test environment.')

      // Connect to the database
      if (mongoose.connection.db) {
        console.log('      * Already connected.')
        mongoose.connection.db.dropCollection('Measurements')
        console.log('      * Dropped Measurements collection.')

        // Close connection.
        mongoose.connection.close()
        return done()
      }
      mongoose.Promise = require('bluebird')
      mongoose.connect(config.db.uri, { useMongoClient: true })
      var db = mongoose.connection
      db.once('open', function () {
        db.db.dropCollection('Measurements')
        console.log('      * Dropped Measurements collection.')

        // Close connection.
        mongoose.connection.close()
        return done()
      })
    })

    // Actual tests
    it('should fetch one measurement', function (done) {
      done()
    })
})
