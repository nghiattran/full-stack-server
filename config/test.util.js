'use strict';

var config = require('./environment');
var crypto = require('crypto');
var request = require('request');
var util = exports;

util.RIGHT_PASSWORD = 'password';
util.WRONG_PASSWORD = 'wrong-password';
util.LOGIN_RETURN_KEYS = ['token'];

exports.ADMIN = {
  username: 'admin',
  password: 'admin',
  email: 'admin@email.com'
}

util.genUserForm = function () {
  return {
    username: crypto.randomBytes(20).toString('hex'),
    password: util.RIGHT_PASSWORD,
    email: crypto.randomBytes(20).toString('hex') + '@email.com'
  }
};

util.signup = function (user, done) {
  request.post({url:config.baseUrl + '/api/user', form: user}, function next(err, res, body) {
    body = JSON.parse(body);
    done(body);
  });
};

util.login = function (user, done) {
  request.post({url:config.baseUrl + '/auth/local', form: user}, function next(err, res, body) {
    body = JSON.parse(body);
    done(body);
  });
};