'use strict';

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');

var service = exports

var session = 'qQ5MxCjb98iBwpIJPWWWPfl2UCHujrP7od5UiUrohaCsf6a4fYBUn0v6tmOAimh';

/**
 * [signToken: create a jwt token]
 * @param  {[str]} id   [user id]
 * @param  {[str]} role [role]
 * @return {[str]}      [jwt token]
 */
service.signToken = function(id, role, username) {
	return jwt.sign({ _id: id, role: role, username: username }, session, {
		expiresIn: 60 * 60 * 5
	});
}

/**
 * [verifyToken description]
 * @param  {[Str]} token [Authorization token]
 */
var verifyToken = function (token, next) {
	jwt.verify(token, session, next);
}

var validateJwt = expressJwt({
  secret: session
});

/**
 * isAuthenticated: check if access token is valid
 * @return {Boolean} [description]
 */
service.isAuthenticated = function () {
  return compose()
    .use(function(req, res, next) {
      // check user access token
      return jwt.verify(req.headers.authorization, session, function(err, user) {
        if (err) {
          return res.status(401).json({error: 'Authorized access'});
        };
        req.user = user;
        return next()
      });
    })
}