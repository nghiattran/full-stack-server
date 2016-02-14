'use strict';

// Include dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var config = require('./config/enviroment');
// create app object
var app = express();

// Set configurations for server
require('./config/express')(app);

// Set routes for server
require('./routes')(app);

// Create server object
var server = http.createServer(app)

// Start server
function startServer() {
  server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;