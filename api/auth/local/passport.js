var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var localPassport = exports;

function localAuthenticate(User, email, password, done) {
	User.findOneAsync({
		email: email.toLowerCase()
	})
	.then(function(user) {
		if (!user) {
			return done(null, false, {
				message: 'This email is not registered.'
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
		usernameField: 'email',
		passwordField: 'password'
	}, function(email, password, done) {
		return localAuthenticate(User, email, password, done);
	}));
}

// passport.use(new LocalStrategy(Account.authenticate()));