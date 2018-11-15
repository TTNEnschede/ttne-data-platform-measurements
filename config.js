'use strict'

module.exports = {
  name: 'ttne-data-platform',
  version: '1.0.0',
  env: process.env.NODE_ENV || 'development',
  log: {
    enabled: process.env.MEASUREMENT_LOGFILE_ENABLED || false,
    path: process.env.MEASUREMENT_LOGFILE_PATH || '/tmp/ttne-data-platform.log'
  },
  service: {
    port: process.env.MEASUREMENT_SERVICE_PORT || 3003,
    base_url: process.env.MEASUREMENT_SERVICE_BASE_URL || 'http://localhost'
  },
  db: {
    uri: process.env.MEASUREMENT_DB_URI || 'mongodb://127.0.0.1:27017/ttne_data'
  },
  mqtt: {
    enabled: process.env.MEASUREMENT_MQTT_ENABLED || false,
    broker_url: process.env.MEASUREMENT_MQTT_BROKER_URL || 'mqtt://localhost',
    ingest_topic: process.env.MEASUREMENT_MQTT_INGEST_TOPIC || 'ingest',
    qos: process.env.MEASUREMENT_MQTT_QOS || 1
  }
}
