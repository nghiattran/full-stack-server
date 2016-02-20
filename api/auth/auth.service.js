'use strict';

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var config = require('../../config/environment');
var service = exports;

/**
 * [signToken: create a jwt token]
 * @param  {[str]} id   [user id]
 * @param  {[str]} role [role]
 * @return {[str]}      [jwt token]
 */
service.signToken = function(id, role, username) {
	return jwt.sign({ _id: id, role: role, username: username }, config.session, {
		expiresIn: 60 * 60 * 5
	});
};

/**
 * [verifyToken description]
 * @param  {[Str]} token [Authorization token]
 */
var verifyToken = function (req, res, next) {
	return jwt.verify(req.headers.authorization, config.session, function(err, user) {
    if (err) {
      return res.status(403).json({error: err.message});
    }
    req.user = user;
    return next();
  });
};

var validateJwt = expressJwt({
  secret: config.session
});

/**
 * isAuthenticated: check if access token is valid
 * @return {Boolean} [description]
 */
service.isAuthenticated = function () {
  return compose()
    .use(verifyToken);
};

/**
 * Checks if the user role meets the minimum requirements of the route
 */
service.hasRole = function (roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(service.isAuthenticated())
    .use(function (req, res, next) {

      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      } else {
        res.status(403).json({error: 'Forbidden'});
      }
    });
};