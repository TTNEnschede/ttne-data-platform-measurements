'use strict'

exports.importData = function (callback) {
  // Add imports here.
  const moment = require('moment')
  const Measurement  = require('./../models/Measurement')

  const measurement_12345_001_001 = new Measurement({
      api_key: 'account_1',
      application_id: '12345',
      device_id: '001',
      type: 'Feature',
      geometry: {
          type: 'Point',
          coordinates: [
              6.8888004, 52.2207814
          ]
      },
      properties: {
        name: '12345_001_20181112114400'
      },
      location: [
          52.2207814, 6.8888004
      ],
      timestamp: moment('20181112T114400').toDate(),
      measurement_type: 'groundwater_level',
      measurement_value: -10
  })

  const measurement_12345_001_002 = new Measurement({
      api_key: 'account_1',
      application_id: '12345',
      device_id: '001',
      type: 'Feature',
      geometry: {
          type: 'Point',
          coordinates: [
              6.8888004, 52.2207814
          ]
      },
      properties: {
        name: '12345_001_20181114114400'
      },
      location: [
          52.2207814, 6.8888004
      ],
      timestamp: moment('20181114T121400').toDate(),
      measurement_type: 'groundwater_level',
      measurement_value: -20
  })

  const measurements = [measurement_12345_001_001, measurement_12345_001_002]

  // Bulk import measurements.
  Measurement.collection.insert(measurements, function (err, measurementDocs) {
    if (err) {
      console.log('Error inserting measurements: ', err)
      callback(err)
    }
    callback(null)
  })
}

exports.deleteData = function (callback) {
  // Add imports here.
  const Measurement  = require('./../models/Measurement')

  Measurement.deleteMany({}, function(err) {
    if (err) {
      console.log('Error deleting measurements: ', err)
      callback(err)
    }
    callback(null)
  })
}
