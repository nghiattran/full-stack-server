'use strict';
var crypto = require("crypto");
var config = require('../../config/environment');
var assert = require('chai').assert;
var http = require('http');
var request = require('request');
var app = require('../../app');
var server = http.createServer(app)

function genUserForm () {
	return {
		username: crypto.randomBytes(20).toString('hex'),
		password: 'password',
		email: crypto.randomBytes(20).toString('hex') + '@yahoo.com'
	}
};

function signup (done) {
	var testForm = genUserForm();
	request.post({url:testUrl, form: testForm}, function optionalCallback(err, res, body) {
		body = JSON.parse(body);
		return body.results;
	});
};

describe('test', function () {
	before(function () {
		server.listen(config.port, config.ip, function() {
			console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
		});
    });

	it('should return 200', function (done) {
		request
			.get(config.baseUrl)
			.on('response', function(res) {
				assert.equal(200, res.statusCode);
				done();
			})
			.on('error', function(err) {
				assert.ifError(err);
			})
	});
});

describe('test: POST /api/users', function () {
	var testUrl = config.baseUrl + '/api/user';

	it('test empty form', function (done) {
		request.post({url:testUrl, form: {}}, function optionalCallback(err, res, body) {
			if (err) {
				assert.ifError(err);
			}
			assert.equal(500, res.statusCode);
			done();
		});
	});

	it('test empty email', function (done) {
		var testForm = genUserForm();
		delete testForm['email']; 
		request.post({url:testUrl, form: testForm}, function optionalCallback(err, res, body) {
			if (err) {
				assert.ifError(err);
			}
			assert.equal(500, res.statusCode);
			done();
		});
	});

	it('test empty username', function (done) {
		var testForm = genUserForm();
		delete testForm['username'];
		request.post({url:testUrl, form: testForm}, function optionalCallback(err, res, body) {
			if (err) {
				assert.ifError(err);
			}
			assert.equal(500, res.statusCode);
			done();
		});
	});

	it('test empty password', function (done) {
		var testForm = genUserForm();
		delete testForm['password'];
		request.post({url:testUrl, form: testForm}, function optionalCallback(err, res, body) {
			if (err) {
				assert.ifError(err);
			}
			assert.equal(500, res.statusCode);
			done();
		});
	});

	it('test post', function (done) {
		var testForm = genUserForm();
		request.post({url:testUrl, form: testForm}, function optionalCallback(err, res, body) {
			if (err) {
				assert.ifError(err);
			}
			body = JSON.parse(body);
			assert.property(body, 'results');
			assert.property(body.results, '_id');
			assert.equal(200, res.statusCode);
			done();
		});
	});
});

describe('auth', function () {
	var testUrl = config.baseUrl + '/auth/local';
	var testUser;

	beforeEach(function (done) {
		var testForm = genUserForm();
		request.post({url:config.baseUrl + '/api/user', form: testForm}, function optionalCallback(err, res, body) {
			body = JSON.parse(body);
			testUser = body.results;
			done();
		});
    });

	it('test auth', function (done) {
		var testForm = testUser;
		testForm.password = 'password';
		request.post({url:testUrl, form: testForm}, function optionalCallback(err, res, body) {
			if (err) {
				assert.ifError(err);
			}
			body = JSON.parse(body);
			assert.property(body, 'token');
			done();
		});
	});

	it('test auth empty form', function (done) {
		var testForm = {};

		request.post({url:testUrl, form: testForm}, function optionalCallback(err, res, body) {
			if (err) {
				assert.ifError(err);
			}
			assert.equal(401, res.statusCode)
			done();
		});
	});

	it('test auth wrong password', function (done) {
		var testForm = testUser;
		request.post({url:testUrl, form: testForm}, function optionalCallback(err, res, body) {
			if (err) {
				assert.ifError(err);
			}
			assert.equal(401, res.statusCode)
			done();
		});
	});
});