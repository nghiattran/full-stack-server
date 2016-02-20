'use strict';

var path = require('path');

var config = {
	// Root path of server
	root: path.normalize(__dirname + '../../'),

	// Server port
	port: process.env.PORT || 9000,

	// Server IP
	ip: process.env.IP || '0.0.0.0',

  userRoles: ['user','admin', 'super admin'],

  session: 'qQ5MxCjb98iBwpIJPWWWPfl2UCHujrP7od5UiUrohaCsf6a4fYBUn0v6tmOAimh',

  database: 'test'
}
// Server base url
config.baseUrl = 'http://' + config.ip + ':' + config.port;
module.exports = config;