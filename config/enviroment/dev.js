'use strict';

var path = require('path');
config = {
	// Server port
	port: process.env.PORT || 9000,

	// Server IP
	ip: process.env.IP || '0.0.0.0',
}

module.exports = config