'use strict';
var crypto = require("crypto");
var config = require('../../config/environment');
var assert = require('chai').assert;
var http = require('http');
var request = require('request');
var app = require('../../app');
var server = http.createServer(app)

const RIGHT_PASSWORD = 'password';
const WRONG_PASSWORD = 'wrong-password';
const LOGIN_RETURN_KEYS = ['token'];

function genUserForm () {
	return {
		username: crypto.randomBytes(20).toString('hex'),
		password: RIGHT_PASSWORD,
		email: crypto.randomBytes(20).toString('hex') + '@email.com'
	}
};

function signup (user, done) {
	request.post({url:config.baseUrl + '/api/user', form: user}, function next(err, res, body) {
		body = JSON.parse(body);
		done(body);
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

describe('test signup: POST /api/users', function () {
	var testUrl = config.baseUrl + '/api/user';

	it('test empty form', function (done) {
		request.post({url:testUrl, form: {}}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(500, res.statusCode);
			assert.property(body, 'error');
			done();
		});
	});

	it('test empty email', function (done) {
		var testForm = genUserForm();
		delete testForm['email']; 
		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(500, res.statusCode);
			assert.property(body, 'error');
			done();
		});
	});

	it('test with duplicate email', function (done) {
		var testForm = genUserForm();
		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			request.post({url:testUrl, form: testForm}, function next(err, res, body) {
				//TODO check
				done();
			});
		});
	});

	it('test empty username', function (done) {
		var testForm = genUserForm();
		delete testForm['username'];
		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(500, res.statusCode);
			assert.property(body, 'error');
			done();
		});
	});

	it('test empty password', function (done) {
		var testForm = genUserForm();
		delete testForm['password'];
		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(500, res.statusCode);
			assert.property(body, 'error');
			done();
		});
	});

	it('test post', function (done) {
		var testForm = genUserForm();
		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.property(body, 'token');
			assert.equal(200, res.statusCode)
			done();
		});
	});
});




describe('test login', function () {
	var testUrl = config.baseUrl + '/auth/local';
	var testUser;

	beforeEach(function (done) {
		testUser = genUserForm();
		signup(testUser, function (user) {
			testUser.id = user.id;
			testUser.token = user.token;
			done()
		});
  });

	it('test successful', function (done) {
		var testForm = {
			username: testUser.username,
			password: RIGHT_PASSWORD
		}
		
		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.property(body, 'token');
			assert.equal(200, res.statusCode)
			done();
		});
	});

	it('test with empty form', function (done) {
		var testForm = {};

		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(401, res.statusCode);
			assert.property(body, 'error');
			done();
		});
	});

	it('test with wrong password', function (done) {
		var testForm = testUser;
		testForm.password = WRONG_PASSWORD;
		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(401, res.statusCode);
			assert.property(body, 'error');
			done();
		});
	});
});

describe('test update', function () {
	var testUrl = config.baseUrl + '/api/user';
	var testUser;

	beforeEach(function (done) {
		testUser = genUserForm();
		signup(testUser, function (user) {
			testUser.id = user.id;
			testUser.token = user.token;
			done()
		});
  });

	it('test successful', function (done) {
		var testUpdateUrl = testUrl + '/' + testUser['id'] + '/setting';
		var testForm = {
			oldPassword: RIGHT_PASSWORD,
			newPassword: 'has changed',
			confirmPassword: 'has changed'
		}

		var headers = {
	    'authorization': testUser.token,
		}

		request.put({url:testUpdateUrl, form: testForm, headers:headers}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.property(body, 'token');
			assert.equal(200, res.statusCode)
			done();
		});
	});

	it('test without token', function (done) {
		var testUpdateUrl = testUrl + '/' + testUser['id'] + '/setting';
		var testForm = {
			oldPassword: RIGHT_PASSWORD,
			newPassword: 'has changed',
			confirmPassword: 'has changed'
		}

		request.put({url:testUpdateUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(403, res.statusCode)
			assert.property(body, 'error');
			done();
		});
	});
});




describe('test reset request', function () {
	var testUrl = config.baseUrl + '/api/user/reset';
	var testUser;

	beforeEach(function (done) {
		testUser = genUserForm();
		signup(testUser, function (user) {
			testUser.id = user.id;
			testUser.token = user.token;
			done()
		});
  });

	it('test successful', function (done) {
		var testForm = {
			email: testUser.email
		}

		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.property(body, 'message');
			assert.equal(200, res.statusCode)
			done();
		});
	});

	it('test with wrong email', function (done) {
		var testForm = {
			email: "email"
		}

		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.property(body, 'error');
			assert.equal(404, res.statusCode)
			done();
		});
	});
});



describe('test get user', function () {
	var testUrl = config.baseUrl + '/api/user';
	var testUser;
	var adminToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmM2NmYyZTRkZWI0MmYxMTgwYTkxMzciLCJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDU1ODQ3MDU5LCJleHAiOjE0NTU4NjUwNTl9.osIREE8E1jozBC2r7lgG2R3KC0uHm7vUxL7T5D6xINA';

	beforeEach(function (done) {
		testUser = genUserForm();

		signup(testUser, function (user) {
			testUser.id = user.id;
			testUser.token = user.token;
			done()
		});
  });

	it('test successful', function (done) {
		var testUpdateUrl = testUrl + '/' + testUser.id;
		var testForm = {
			isActivated: true
		}
		var headers = {
	    'authorization': adminToken
		}

		request.put({url:testUpdateUrl, form: testForm, headers: headers}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(200, res.statusCode)
			for (var key in testForm)
			{
				assert.equal(testForm[key], body[key])
			}
			done();
		});
	});

	it('test with user token', function (done) {
		var testUpdateUrl = testUrl + '/' + testUser.id;
		var testForm = {
			isActivated: true
		}
		var headers = {
	    'authorization': testUser.token,
		}

		request.put({url:testUpdateUrl, form: testForm, headers: headers}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(403, res.statusCode)
			done();
		});
	});

	it('test without token', function (done) {
		var testUpdateUrl = testUrl + '/' + testUser.id;
		var testForm = {
			isActivated: true
		}

		request.put({url:testUpdateUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(403, res.statusCode)
			done();
		});
	});
	
});

// admin id
// 56c66f2e4deb42f1180a9137
// admin token
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmM2NmYyZTRkZWI0MmYxMTgwYTkxMzciLCJyb2xlIjoidXNlciIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE0NTU4NDUxNjYsImV4cCI6MTQ1NTg2MzE2Nn0.kewOvI07oanrcLPiHFmrncOSWBjgcAEOkTZChVfG_1o