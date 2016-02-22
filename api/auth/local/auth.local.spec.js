'use strict';
var config = require('../../../config/environment');
var assert = require('chai').assert;
var http = require('http');
var request = require('request');
var app = require('../../../app');
var testUtil = require('../../../config/test.util');

/**
 * 
 */

describe('test local auth', function () {

  /**
   * 
   */

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
      var testForm = testUtil.genUserForm();
      delete testForm['email']; 
      request.post({url:testUrl, form: testForm}, function next(err, res, body) {
        body = JSON.parse(body);
        assert.equal(500, res.statusCode);
        assert.property(body, 'error');
        done();
      });
    });

    it('test with duplicate email', function (done) {
      var testForm = testUtil.genUserForm();
      request.post({url:testUrl, form: testForm}, function next(err, res, body) {
        request.post({url:testUrl, form: testForm}, function next(err, res, body) {
          //TODO check
          done();
        });
      });
    });

    it('test empty username', function (done) {
      var testForm = testUtil.genUserForm();
      delete testForm['username'];
      request.post({url:testUrl, form: testForm}, function next(err, res, body) {
        body = JSON.parse(body);
        assert.equal(500, res.statusCode);
        assert.property(body, 'error');
        done();
      });
    });

    it('test empty password', function (done) {
      var testForm = testUtil.genUserForm();
      delete testForm['password'];
      request.post({url:testUrl, form: testForm}, function next(err, res, body) {
        body = JSON.parse(body);
        assert.equal(500, res.statusCode);
        assert.property(body, 'error');
        done();
      });
    });

    it('test post', function (done) {
      var testForm = testUtil.genUserForm();
      request.post({url:testUrl, form: testForm}, function next(err, res, body) {
        body = JSON.parse(body);
        assert.property(body, 'token');
        assert.equal(200, res.statusCode)
        done();
      });
    });
  });

  /**
   * 
   */

  describe('test login', function () {
    var testUrl = config.baseUrl + '/auth/local';
    var testUser;

    beforeEach(function (done) {
      testUser = testUtil.genUserForm();
      testUtil.signup(testUser, function (user) {
        testUser.id = user.id;
        testUser.token = user.token;
        done()
      });
    });

    it('test successful', function (done) {
      var testForm = {
        username: testUser.username,
        password: testUtil.RIGHT_PASSWORD
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
      testForm.password = testUtil.WRONG_PASSWORD;
      request.post({url:testUrl, form: testForm}, function next(err, res, body) {
        body = JSON.parse(body);
        assert.equal(401, res.statusCode);
        assert.property(body, 'error');
        done();
      });
    });
  });

}); 
