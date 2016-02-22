'use strict';

var User = require('./user.model');
var signToken = require('../auth/auth.service').signToken;
var crypto = require('crypto');
var url = require('url');
var controller = exports;
var qs = require('qs');
var _ = require('lodash');

/**
 * This function is a callback for handling errors
 * @param  {[type]} res        request object
 * @param  {[type]} statusCode error code
 * @return {[type]}            [description]
 */
function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		var error = {};
		for (var field in err.errors)
		{
			error[field] = err.errors[field].message;
		}
		res.status(statusCode).json({error: error});
	};
}

/**
 * This function is a callback for handling validation errors for mongoose
 * @param  {[type]} res        request object
 * @param  {[type]} statusCode error code
 * @return {[type]}            [description]
 */
function validationError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).json({error: err});
  };
}

/**
 * This method handles signup requests 
 * @param  {[type]}   req  request object
 * @param  {[type]}   res  response object
 * @param  {Function} next callback for what to do next
 * @return {[type]}        
 */
controller.signup = function (req, res) {
	var newUser = new User(req.body);
	if (newUser.password) {
		newUser.password = newUser.encryptPassword(newUser.password);
	}

	newUser.saveAsync()
		.then(function(result) {
			return res.json(controller.setUserReturnObject(result));
		})
		.catch(validationError(res));
};

/**
 * This method handles update password requests 
 * @param  {[type]}   req  request object
 * @param  {[type]}   res  response object
 * @param  {Function} next callback for what to do next
 * @return {[type]}        
 */
controller.updateUser = function (req, res) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);
	var conPass = String(req.body.confirmPassword);

	if (newPass != conPass) {
		return res.status(500).json({
			message:"New password and confirm password don't match"
		});
	}

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
			.catch(validationError(res));

		} else {
			return res.status(404).json({'error': 'Wrong password.'});
    }
	}).catch(validationError(res));
};

/**
 * This method handles update password requests 
 * @param  {[type]}   req  request object
 * @param  {[type]}   res  response object
 * @param  {Function} next callback for what to do next
 * @return {[type]}        
 */
controller.updateUserAdmin = function (req, res) {
	var userId = req.params.id;

	// Get user info
	User.findByIdAsync(userId)
	.then(function (user) {

		for(var key in user)
		{
			if (req.body[key] && typeof req.body[key] !== 'function') {
				user[key] = req.body[key];
			}
		}

		return user.saveAsync(function(err, result){
			return res.json(result);
		});
	}).catch(validationError(res));
};

/**
 * This method creates reset token for forgot password requests 
 * @param  {[type]}   req  request object
 * @param  {[type]}   res  response object
 * @param  {Function} next callback for what to do next
 * @return {[type]}        
 */
function createResetToken (req, res, next) {
	var email = String(req.body.email);

	User.findOneAsync({ 'email' :  email }).then(function (user) {
		if (user) {

			user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordExpires = Date.now() + 3600000;

      // it smells here
			return user.saveAsync(function(err, user){
				next(req, res, user);
			}).catch(validationError(res));
		} else {
			return res.status(404).json({'error': 'No account with that email address exists.'});
		}
	}).catch(validationError(res));
}


// TODO add sendgrid
/**
 * This function send reset email to user
 * @param  {[type]} user user object
 * @return {[type]}      [description]
 */
function sendResetEmail (req, res, user) {
	return res.status(200).json({message: 'Email has been sent.'});
}

/**
 * This method handles forgot password requests 
 * @param  {[type]}   req  request object
 * @param  {[type]}   res  response object
 * @param  {Function} next callback for what to do next
 * @return {[type]}        
 */
controller.handleResetRequest = function (req, res, next) {
	return createResetToken(req, res, sendResetEmail);
};

/**
 * This method handles reset password requests 
 * @param  {[type]}   req  request object
 * @param  {[type]}   res  response object
 * @param  {Function} next callback for what to do next
 * @return {[type]}        
 */
controller.handleResetPassword = function (req, res, next) {
	var newPass = String(req.body.newPassword);
	var conPass = String(req.body.confirmPassword);
	var resetToken = String(req.body.resetPasswordToken);

	if (newPass !== conPass) {
		return res.status(400).json({error: "Two passwords don't match."});
	}

	var params = { 
		resetPasswordToken: resetToken, 
		resetPasswordExpires: { $gt: Date.now() }
	};

	User.findOne(params)
		.then(function (user) {
			if (user) {
				user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
	      user.resetPasswordExpires = Date.now() + 3600000;

				return user.saveAsync(function(err, result){
					return res.status(200).json({'message': 'Success! Your password has been changed.'});
				}).catch(validationError(res));
			} else {
				return res.status(400).json({'error': 'Password reset token is invalid or has expired.'});
			}
		});
};

/**
 * This method creates a access token for client
 * @param {[type]} user [description]
 */
controller.setUserReturnObject = function (user){
	return {
		token: signToken(user._id, user.role, user.username),
		id : user._id
	};
};

controller.getUsers = function (req, res, next) {
	var param = req.params.where || {};
	if (req.params && req.params.id) {
		param = {
			_id: req.params.id,
		}
	}

	var urlParts = url.parse(req.url, true);
	var query = qs.parse(url.parse(req.url, true).query);
	query.select = mongoosizeQueryString(query.select);

	User.find(query.where || {})
		.limit(query.limit || 100)
		.select(query.select || null)
		.then(function (results) {
			return res
				.status(200)
				.json({results: results});
		}).catch(handleError(res));
};

controller.getUser = function (req, res, next) {
	var userId = req.params.id;

	var urlParts = url.parse(req.url, true);
	var query = qs.parse(url.parse(req.url, true).query);
	query.select = mongoosizeQueryString(query.select);
	User.findById(userId)
		.select(query.select || null)
		.then(function (results) {
			return res
				.status(200)
				.json({results: results});
		}).catch(handleError(res));
};


var mongoosizeQueryString = function (qs) {
	_(qs).forEach(function (value, key) {
		if (typeof value === 'object') {
			qs[key] = mongoosizeQueryString(value);
		} else if (typeof value === 'string') {
			qs[key] = value == 'true';
		}
	})
	return qs;
}