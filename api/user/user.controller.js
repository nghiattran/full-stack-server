'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var User = require('./user.model')
var mongoose = require('mongoose');
var _ = require('underscore');
var signToken = require('../auth/auth.service').signToken
var crypto = require('crypto');

var controller = exports;

/**
 * This function is a callback for handling errors
 * @param  {[type]} res        request object
 * @param  {[type]} statusCode error code
 * @return {[type]}            [description]
 */
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

/**
 * This function is a callback for handling validation errors for mongoose
 * @param  {[type]} res        request object
 * @param  {[type]} statusCode error code
 * @return {[type]}            [description]
 */
function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json({error: err});
  }
}

/**
 * This method handles signup requests 
 * @param  {[type]}   req  request object
 * @param  {[type]}   res  response object
 * @param  {Function} next callback for what to do next
 * @return {[type]}        
 */
controller.signup = function (req, res, next) {
	var newUser = new User(req.body);
	if (newUser.password) {
		newUser.password = newUser.encryptPassword(newUser.password);
	};

	newUser.saveAsync(function(err, results)
	{
		if (err) {
			if (err.code === 11000) {
				return res.json({
					error: {message: 'This email has been used.'}, 
					code: err.code});
			} 
			else {
				return res.json({
					error: {message: err.message}, 
					code: err.code});
			}
		}
		
		return res.json(controller.setUserReturnObject(results));
	}).catch(handleError(res));
}

/**
 * This method handles update password requests 
 * @param  {[type]}   req  request object
 * @param  {[type]}   res  response object
 * @param  {Function} next callback for what to do next
 * @return {[type]}        
 */
controller.updateUser = function (req, res, next) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);
	var conPass = String(req.body.confirmPassword);

	if (newPass != conPass) {
		return res.status(500).json({
			message:"New password and confirm password don't match"
		});
	};

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
			return res.status(404).json({'error': 'Wrong password.'})
    }
	}).catch(validationError(res))
}

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

			user.resetPasswordToken = crypto.randomBytes(20).toString('hex');;
      user.resetPasswordExpires = Date.now() + 3600000;

			return user.saveAsync(function(err, result){
				next(err, user);
			}).catch(validationError(res))
		} else {
			return res.status(404).json({'error': 'No account with that email address exists.'})
		}
	}).catch(validationError(res))
}

/**
 * This function send reset email to user
 * @param  {[type]} user user object
 * @return {[type]}      [description]
 */
function sendResetEmail (user) {

	// return res.json({token: user.resetPasswordToken, email: user.email})
}

/**
 * This method handles forgot password requests 
 * @param  {[type]}   req  request object
 * @param  {[type]}   res  response object
 * @param  {Function} next callback for what to do next
 * @return {[type]}        
 */
controller.handleResetRequest = function (req, res, next) {
	return createResetToken(req, res, function (err, user) {
		return res.status(200).json({message: 'Email has been sent.'});
	})
}

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
	};

	var params = { 
		resetPasswordToken: resetToken, 
		resetPasswordExpires: { $gt: Date.now() }
	}

	User.findOne(params)
		.then(function (user) {
			if (user) {
				user.resetPasswordToken = crypto.randomBytes(20).toString('hex');;
	      user.resetPasswordExpires = Date.now() + 3600000;

				return user.saveAsync(function(err, result){
					return res.status(200).json({'message': 'Success! Your password has been changed.'})
				}).catch(validationError(res))
			} else {
				return res.status(400).json({'error': 'Password reset token is invalid or has expired.'})
			}
		})
}

/**
 * This method creates a access token for client
 * @param {[type]} user [description]
 */
controller.setUserReturnObject = function (user){
	return {
		token: signToken(user._id, user.role, user.username),
		id : user._id
	}
}