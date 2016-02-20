'use strict';

// Include dependencies
var log = require('npmlog');
var express = require('express');
var http = require('http');
var config = require('./config/environment');
var mongoose = require('mongoose');

// connect to mongo
mongoose.connect('mongodb://localhost/' + config.database);

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
		log.info('Express server listening on ' + config.port + ', in ' + app.get('env') + ' mode');
	});
}

startServer();

// Expose app
exports = module.exports = app;