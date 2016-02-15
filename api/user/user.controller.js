'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var User = require('./user.model')
var mongoose = require('mongoose');
var _ = require('underscore');
var signToken = require('../auth/auth.service').signToken

var controller = exports;

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		var error = {}
		for (var field in err.errors)
		{
			error[field] = err.errors[field]['message'];
		}
		res.status(statusCode).json({error: error});
	};
}

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

controller.signup = function (req, res, cb) {
	var newUser = new User(req.body);
	if (newUser.password) {
		newUser.password = newUser.encryptPassword(newUser.password);
	};

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
		}
		
		return res.json(controller.setUserReturnObject(results));
		// return res.json({results: results});
	}).catch(handleError(res));
}

controller.updatePassword = function (req, res, cb) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);

	// Get user info
	User.findByIdAsync(userId)
	.then(function (user) {
		if (user.authenticate(oldPass, user.password)) {

			// Update info
			user.password = user.encryptPassword(newPass);
			user.updatedAt = new Date();

			// Save to database
			return user.saveAsync(function(err, result){
				return res.json(controller.setUserReturnObject(result));
			})
			.catch(validationError(res))

		} else {
      return res.status(403).end();
    }
	}).catch(validationError(res))
}


controller.setUserReturnObject = function (user){
	return {
		token: signToken(user._id, user.role, user.username),
		id : user._id
	}
}