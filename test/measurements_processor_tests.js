'use strict'

const config      = require('./../config')
const mongoose    = require('mongoose')
const processor   = require('./../processor/ingest_processor')
const supertest   = require('supertest')
const should      = require('should')

const Measurement = require('./../models/Measurement');

var db

describe("* Measurements processor tests", function () {

  // Setup test environment.
  before(function (done) {
    // Before test execution
    console.log('    - Set up measurements processor test environment.')

    // Connect to the database (if not yet connected)
    if (mongoose.connection.db) {
      console.log('      * Already connected.')
      return done()
    }
    mongoose.Promise = require('bluebird')
    mongoose.connect(config.db.uri, { useMongoClient: true })
    db = mongoose.connection
    db.once('open', function () {
      console.log('      * Connected to test database.')
      return done()
    })
  })

  // Teardown test environment.
  after(function (done) {
    // After test execution
    console.log('    - Tear down measurements processor test environment.')

    // Drop collection
    db = mongoose.connection
    db.db.dropCollection('Measurements')
    console.log('      * Dropped Measurements collection.')

    // Close connection.
    mongoose.connection.close()
    return done()
  })

  const test_api_key = '12345'
  const test_app_id = 'app-123'
  const test_dev_id = 'dev-345'

  // Actual tests
  it('should store one measurement', function (done) {
    let ingest = {
      created_on: Date.now,
      api_key: test_api_key,
      payload: {
        downlink_url: '',
        metadata: {},
        payload_fields: {
          temperature: 28.7
        },
        payload_raw: '',
        counter: 1,
        port: 1,
        hardware_serial: '',
        dev_id: test_dev_id,
        app_id: test_app_id
      }
    }

    processor.process_ingest_message(ingest)

    const fields = {}
    const where = {}
    Measurement.find(where, fields)
      .exec( function (err, measurementDocs) {
        console.log('TEST')
        if (err) {
          return done(err)
        }
        measurementDocs.length.should.be.exactly(1)

        return done()
      })
  })
})
