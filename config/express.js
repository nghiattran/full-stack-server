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
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(passport.initialize());
	app.use(passport.session());

	// Add headers
	app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
	});
}