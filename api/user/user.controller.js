'use strict';

var User = require('./user.model')
var mongoose = require('mongoose');


var controller = exports;

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		var result = {}
		for (var field in err.errors)
		{
			result[field] = err.errors[field]['message'];
		}
		res.status(statusCode).send(result);
	};
}

controller.signup = function (req, res, cb) {
	var newUser = new User(req.body);
	newUser.password = newUser.encryptPassword(newUser.password);
	newUser.saveAsync(function(err, results)
	{
		if (err) {
			if (err.code === 11000) {
				return res.json({
					message: 'This email has been used.', 
					code: err.code});
			} 
			else {
				return res.json({
					message: err.message, 
					code: err.code});
			}
		};
		return res.json({results: results});
	}).catch(handleError(res));
}

