'use strict';

var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');

exports = module.exports = function (app) {
	app.set('appName', 'hello-world');
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, '../views'));
	// html file parser
	app.engine('html', require('ejs').renderFile);
	// Session
	app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
	// app.use(session({secret: '2C44774A-D649-4D44-9535-46E296EF984F'}));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(passport.initialize());
	app.use(passport.session());
}