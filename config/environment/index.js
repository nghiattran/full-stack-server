'use strict';

var path = require('path');

var config = {
	// Root path of server
	root: path.normalize(__dirname + '../../'),

	// Server port
	port: process.env.PORT || 9000,

	// Server IP
	ip: process.env.IP || '0.0.0.0',

}
// Server base url
config.baseUrl = 'http://' + config.ip + ':' + config.port;
module.exports = config;