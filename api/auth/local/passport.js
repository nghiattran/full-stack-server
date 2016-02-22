var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var localPassport = exports;

function localAuthenticate(User, username, password, done) {
	User.findOneAsync({
		username: username.toLowerCase()
	})
	.then(function(user) {
		if (!user) {
			return done(null, false, {
				message: 'This username is not registered.'
			});
		}

		user.authenticate(password, user.password, function(authenticated) {
			if (!authenticated) {
				return done(null, false, { message: 'This password is not correct.' });
			} else {
				return done(null, user);
			}
		});
	})
	.catch(function(err){
		done(err)
	});
 	// return done(null, user);
}



localPassport.setup = function(User, config) {
	passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	}, function(username, password, done) {
		return localAuthenticate(User, username, password, done);
	}));
}

// passport.use(new LocalStrategy(Account.authenticate()));