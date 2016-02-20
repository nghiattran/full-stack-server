'use strict';
var crypto = require('crypto');
var config = require('../../config/environment');
var assert = require('chai').assert;
var request = require('request');
var testUtil = require('../../config/test.util');

/**
 * Test if the server is up
 */

describe('test connection', function () {
	it('test successful', function (done) {
		request
			.get(config.baseUrl)
			.on('response', function(res) {
				assert.equal(200, res.statusCode);
				done();
			})
			.on('error', function(err) {
				assert.ifError(err);
			});
	});
});

/**
 * Test case for api/user endpoint
 */

describe('test update', function () {
	var testUrl = config.baseUrl + '/api/user';
	var testUser;

	beforeEach(function (done) {
		testUser = testUtil.genUserForm();
		testUtil.signup(testUser, function (user) {
			testUser.id = user.id;
			testUser.token = user.token;
			done();
		});
  });

	it('test successful', function (done) {
		var testUpdateUrl = testUrl + '/' + testUser.id + '/setting';
		var testForm = {
			oldPassword: testUtil.RIGHT_PASSWORD,
			newPassword: 'has changed',
			confirmPassword: 'has changed'
		};

		var headers = {
	    'authorization': testUser.token,
		};

		request.put({url:testUpdateUrl, form: testForm, headers:headers}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.property(body, 'token');
			assert.equal(200, res.statusCode);
			done();
		});
	});

	it('test without token', function (done) {
		var testUpdateUrl = testUrl + '/' + testUser.id + '/setting';
		var testForm = {
			oldPassword: testUtil.RIGHT_PASSWORD,
			newPassword: 'has changed',
			confirmPassword: 'has changed'
		};

		request.put({url:testUpdateUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.equal(403, res.statusCode);
			assert.property(body, 'error');
			done();
		});
	});
});

/**
 * Test cases for api/user/reset
 */

describe('test reset request', function () {
	var testUrl = config.baseUrl + '/api/user/reset';
	var testUser;

	beforeEach(function (done) {
		testUser = testUtil.genUserForm();
		testUtil.signup(testUser, function (user) {
			testUser.id = user.id;
			testUser.token = user.token;
			done();
		});
  });

	it('test successful', function (done) {
		var testForm = {
			email: testUser.email
		};

		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.property(body, 'message');
			assert.equal(200, res.statusCode);
			done();
		});
	});

	it('test with wrong email', function (done) {
		var testForm = {
			email: "email"
		};

		request.post({url:testUrl, form: testForm}, function next(err, res, body) {
			body = JSON.parse(body);
			assert.property(body, 'error');
			assert.equal(404, res.statusCode)
			done();
		});
	});
});

/**
 * 	Test cases for api/user endpoint
 */

describe('test get user', function () {
	var testUrl = config.baseUrl + '/api/user';
	var testUser;
	var adminToken;

	before(function (done) {
		testUtil.login(testUtil.ADMIN, function (admin) {
			adminToken = admin.token;
			done();
		})
	})

	beforeEach(function (done) {
		testUser = testUtil.genUserForm();

		testUtil.signup(testUser, function (user) {
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

	it('test with unauthorized token', function (done) {
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