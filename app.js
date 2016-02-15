'use strict';

// Include dependencies
var express = require('express');
var http = require('http');
var config = require('./config/environment');
var mongoose = require('mongoose');

// connect to mongo
mongoose.connect('mongodb://localhost/test');

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

if (process.env.NODE_ENV === 'dev') {
	setImmediate(startServer);
};

// Expose app
exports = module.exports = app;