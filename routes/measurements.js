const errors = require('restify-errors')
const Router = require('restify-router').Router
const router = new Router()

const moment = require('moment')
const Measurement = require('./../models/Measurement')

/**
 * @api {get} /api/measurements List measurements
 * @apiVersion 1.0.0
 * @apiParam {Number} [limit=10] A limit on the amount of results returned.
 * @apiParam {Number} [longitude] The longitude for a location based query. Must be used in combination with <i>latitude</i> and <i>radius</i>.
 * @apiParam {Number} [latitude] The latitude for a location based query. Must be used in combination with <i>longitude</i> and <i>radius</i>.
 * @apiParam {Number} [radius=10] The radius in kilometers used to perform the location based query.
 * Should only be used with the parameters <i>longitude</i> and <i>latitude</i>.
 * @apiParam [geojson] Format the location information of the returned results according to the GeoJSON format.
 *
 * @apiHeader {String} apikey An access-key.
 * @apiDescription With this api end point the devices can be queried.
 *
 * @apiGroup Measurement
 * @apiSuccess {Measurement[]} devices A list of measurements.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      devices:
 *          {
 *              "location": [
 *                  52.197777,
 *                  6.8584485
 *               ],
 *              "owner": {
 *                   "registered_on": "2017-08-07T07:14:24.436Z"
 *              },
 *              "application_id": "app-001",
 *              "device_id": "basic-lora-001"
 *          },
 *          {
 *              ...
 *          }
 *    }
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.1 400 Bad Request
 */
router.get('/measurements', function (req, res, next) {

  // Limit the maximum amount of results.
  var limit = parseInt(req.query.limit) || 10

  // Query fields and filters.
  var where = {}
  var fields = {
    application_id: true,
    device_id: true,
    timestamp: true,
    measurement_type: true,
    measurement_value: true,
    _id: false
  }

  // Format data in geojson format.
  if (req.query.geojson !== undefined) {
    fields.type = true
    fields.geometry = true
    fields.properties = true
  } else {
    fields.location = true
  }

  // Filter by device.
  if (req.query.device_id !== undefined) {
    where.device_id = req.query.device_id
  }

  // Filter by measurement type.
  if (req.query.measurement_type !== undefined) {
    where.measurement_type = req.query.measurement_type
  }

  // Filter by start and/or end date.
  if (req.query.start !== undefined) {
    where.timestamp = { $gte: moment(req.query.start).toDate() }
    if (req.query.end !== undefined) {
      // Check if start is before end date.
      if (moment(req.query.start).isAfter(moment(req.query.end))){
        return next(new errors.BadRequestError({message: 'Start date cannot be before end date.'}))
      }
      // Filter between start and end date.
      where.timestamp = {
        $gte: moment(req.query.start).toDate(),
        $lte: moment(req.query.end).endOf('day').toDate()
       }
    }
  } else if (req.query.end !== undefined) {
    where.timestamp = { $lte: moment(req.query.end).endOf('day').toDate() }
  }

  // Validate location parameters.
  if (req.query.longitude !== undefined && req.query.latitude === undefined ) {
    return next(new errors.BadRequestError({message: 'Latitude parameter is missing.'}))
  }
  if (req.query.longitude === undefined && req.query.latitude !== undefined) {
    return next(new errors.BadRequestError({message: 'Longitude parameter is missing.'}))
  }

  // Do a location based search if lat and long is supplied.
  if (req.query.longitude !== undefined && req.query.latitude !== undefined ) {
    // Store coordinates in array [  <latitude>, <longitude> ]
    var coords = [];
    coords[0] = req.query.latitude;
    coords[1] = req.query.longitude;

    // Set the distance or default to 10 kilometers and convert distance
    // to radians (raduis of Earth is approximately 6378.1 kilometers).
    var radius = req.query.distance || 10;
    radius /= 6378.1;

    // Set query filter.
    where.location = { $geoWithin: { $centerSphere: [ coords , radius ] } };
  }

  // Do actual query.
  Measurement.find(where, fields)
    .limit(limit)
    .sort({'timestamp': -1})
    .exec( function (err, measurementDocs) {
      if (err) {
        log.error(err)
        return next(new errors.InternalError('Error querying measurements.'))
      }
      // Format response either as a collection of devices
      // or a GeoJSON FeatureCollection.
      var responseBody = { measurements: measurementDocs }
      if (req.query.geojson !== undefined) {
        responseBody = {
          type: 'FeatureCollection',
          features: measurementDocs
        }
      }
      res.send(responseBody)
      next()
  })
})

module.exports = router;
