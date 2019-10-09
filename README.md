# TTNE Data Platform Measurements
The measurements service of the data platform is for storing and retrieving measurements send by devices using the things network (TTN).

# Features
This repository contains a REST service which contains a GET endpoint for retrieving measurements stored in the platform. Data is processed from data received from the ingest service and is stored in a mongo database. Optionally the playload data can be (re)published to a (local) MQTT broker for further processing.

# Run
Start the service using npm start (from the command line). Be sure to install the required packages first by running npm install.

```
npm install
npm start
```

# Configuration
The service can be configure with the following environment variables:
```
MEASUREMENT_LOGFILE_ENABLED: Configures whether logging is enabled (default = false)
MEASUREMENT_LOGFILE_PATH: If MEASUREMENT_LOGFILE_ENABLED is set to true, configures the path where to store the logs (default = '/tmp/ttne-data-platform.log')
MEASUREMENT_SERVICE_PORT: The HTTP port on which the service listens (default = 3003)
MEASUREMENT_SERVICE_BASE_URL: The base url on which the server listens (default = 'http://localhost')
MEASUREMENT_DB_URI: The (Mongo) database in which to store and retrieve data (default = 'mongodb://127.0.0.1:27017/ttne_data')
MEASUREMENT_MQTT_ENABLED: Whether the service should connect to an MQTT broker (default = false)
MEASUREMENT_MQTT_BROKER_URL: If MEASUREMENT_MQTT_ENABLED is set to true, this variable tells the service where to connect to the MQTT broker (default = 'mqtt://localhost')
MEASUREMENT_MQTT_INGEST_TOPIC: If MEASUREMENT_MQTT_ENABLED is set to true, this variable tells the service on which topic to subscribe at the MQTT broker (default = 'ingest')
MEASUREMENT_MQTT_QOS: If MEASUREMENT_MQTT_ENABLED is set to true, this variable tells the service which Quality of Service level to use when connecting to the MQTT broker. Valid options are 1, 2 or 3 (default = 1)
```

See config.js for configuration parameters.

Application supports dotenv. Add environment variables in a '.env' file in the root folder and they will be picked up by the application.
