'use strict';

var config = require('../../config/enviroment');
var assert = require('assert');
var http = require('http');
var request = require('request');
var app = require('../../app');
var server = http.createServer(app)


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

// describe('test: GET /api/users', function () {
// 	var testUrl = config.baseUrl + '/api/users';
// 	it('should return 200', function (done) {
// 		http.get(testUrl, function (res) {
// 			assert.equal(200, res.statusCode);
// 			done();
// 		});
// 	});
// });

// describe('test: POST /api/users', function () {
// 	var testUrl = config.baseUrl + '/api/users';
// 	it('should return 200', function (done) {
// 		http.get(testUrl, function (res) {
// 			assert.equal(200, res.statusCode);
// 			done();
// 		});
// 	});
// });