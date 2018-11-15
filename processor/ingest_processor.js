'use strict'

const config      = require('./../config');
const util        = require('util');
const Measurement = require('./../models/Measurement');

module.exports.process_ingest_message = function(ingest) {
  // Steps:
  // * Check if device exist? No, we will allow orphaned data.
  // * Check location (copy devices location or from the payload_fields)
  // * For every entry in payload_fields:
  //   - Validate type (against metadataservice)
  //   - Validate value (belonging to type against metadataservice)
  //   - Create measurement
  // * Store measurements in batch (including rollback on failure)

  // TODO: Validate ingest message.

  // Process message.
  const isE = isEmpty(ingest.payload.payload_fields)
  console.log('Has payload fields: ', !isE)
  if (!isE) {
    let measurements = []
    // * For every element in payload_fields:
    //   - Validate type (against metadataservice)
    //   - Validate value (belonging to type against metadataservice)
    //   - Create measurement
    const keys = Object.keys(ingest.payload.payload_fields)
    console.log('Keys: ', keys)
    for(var i = 0; i < keys.length; i++) {
      console.log('Key: ', keys[i])
      const field = ingest.payload.payload_fields[keys[i]]
      console.log(field)

      //TODO: Location stuff.
      measurements.push(
        new Measurement({
          api_key: ingest.api_key,
          application_id: ingest.payload.app_id,
          device_id: ingest.payload.dev_id,
          measurement_type: keys[i],
          measurement_value: field
        })
      )
    }

    // Bulk import measurements.
    Measurement.collection.insert(measurements, function (err, measurementDocs) {
      if (err) {
        log.error('Error inserting measurements: ', err)
      } else {
        log.info('Inserted %d measurements', measurementDocs.insertedCount)
      }
    })
  }

  return
}

function isEmpty(obj) {
  return !obj || Object.keys(obj).length == 0
}
