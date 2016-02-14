'use strict';

var UserModel = require('./user.model')

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		res.status(statusCode).send(err);
	};
}

var signup = function (req, res, cb) {
	var newUser = new UserModel(req.body);
	UserModel.saveAsync(function(err, results)
		{
			if (err) {
				return handleError(err);
			} else {
				return results;
			}
		});
}