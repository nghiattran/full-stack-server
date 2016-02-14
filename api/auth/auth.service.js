'use strict';

var jwt = require('jsonwebtoken');

var service = exports

/**
 * Returns a jwt token signed by the app secret
 */
service.signToken = function(id, role) {
	return jwt.sign({ _id: id, role: role }, "qQ5MxCjb98iBwpIJPWWWPfl2UCHujrP7od5UiUrohaCsf6a4fYBUn0v6tmOAimh", {
		expiresIn: 60 * 60 * 5
	});
}