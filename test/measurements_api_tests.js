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
      mongoose.Promise = require('bluebird')
      mongoose.connect(config.db.uri, { useMongoClient: true })
      var db = mongoose.connection
      db.once('open', function () {
        testdata.deleteData(function (err) {
          console.log('      * Dropped Measurements collection.')

          // Close connection.
          mongoose.connection.close()
          return done()
        })
      })
    })

    // Actual tests
    it('should return a list of 2 measurements', function (done) {
      server.get('/api/measurements')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(2)

          done()
        })
    })

    it('should return an error for end date before start date', function (done) {
      server.get('/api/measurements?start=20181112&end=20181110')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(400)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          res.body.message.should.be.exactly('Start date cannot be before end date.')
          done()
        })
    })

    it('should return a list of 1 measurements for same start date and end date (20181112)', function (done) {
      server.get('/api/measurements?start=20181112&end=20181112')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(1)

          done()
        })
    })

    it('should return a list of 0 measurements for same start date and end date (20181110)', function (done) {
      server.get('/api/measurements?start=20181110&end=20181110')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(0)

          done()
        })
    })

    it('should return a list of 2 measurements (after 20181112)', function (done) {
      server.get('/api/measurements?start=20181112')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(2)

          done()
        })
    })

    it('should return a list of 0 measurements (before 20181110)', function (done) {
      server.get('/api/measurements?end=20181110')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(0)

          done()
        })
    })

    it('should return a list of 1 measurements (after 20181112 and before 20181113)', function (done) {
      server.get('/api/measurements?start=20181112&end=20181113')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(1)

          done()
        })
    })

    it('should return a list of 1 measurements (after 20181113)', function (done) {
      server.get('/api/measurements?start=20181113')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(1)

          done()
        })
    })

    it('should return a list of 1 measurements (before 20181113)', function (done) {
      server.get('/api/measurements?end=20181113')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(1)

          done()
        })
    })

    it('should return a list of 1 measurements (after 20181113 and before 20181122)', function (done) {
      server.get('/api/measurements?start=20181113&end=20181122')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(1)

          done()
        })
    })

    it('should return a list of 0 measurements (after 20181122)', function (done) {
      server.get('/api/measurements?start=20181122')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(0)

          done()
        })
    })

    it('should return a list of 0 measurements (after 20181122 and before 20181124)', function (done) {
      server.get('/api/measurements?start=20181122&end=20181124')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(0)

          done()
        })
    })

    it('should return a list of 2 measurements (before 20181124)', function (done) {
      server.get('/api/measurements?end=20181124')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
              return done(err)
          }
          var measurements = res.body.measurements
          measurements.length.should.be.exactly(2)

          done()
        })
    })
})
