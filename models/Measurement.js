const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var measurementSchema = new Schema({
  // Owner api key.
  api_key: { type: String, required: true },
  // Application id.
  application_id: { type: String, required: true },
  // (external ttn) Device's id.
  device_id: { type: String, required: true },
  // Location of the measurement.
  location: {type: [Number], index: '2dsphere'},
  // Same location information but in GeoJSON format.
  type: { type: String, default: 'Feature'},
  geometry: {
    type: { type: String, default: 'Point' },
    coordinates: {type: [Number], index: '2dsphere'}
  },
  // Properties are required for GeoJSON.
  properties: {
    name: { type: String, required: true }
  },
  // Timestamp of the measurement.
  timestamp: { type: Date, required: true, default: Date.now },
  // Type of the measurement.
  measurement_type: { type: String, required: true },
  // The actual measurement (can be anything).
  measurement_value: {}
},
{
	// Timestamping on create and update.
	timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }
})

module.exports = mongoose.model("Measurement", measurementSchema)
