'use strict';

var Router = require('express').Router;
var controller = require('./user.controller');
var auth = require('../auth/auth.service');

var router = new Router();
router.get('/', function(req, res) {
	res.json({get: 'nothing'});
})
router.post('/', controller.signup);

// router.get('/', auth.hasRole('admin'), controller.index);
// router.delete('/:id', auth.hasRole('admin'), controller.destroy);
// router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.updatePassword);
router.post('/reset', controller.handleResetRequest);
router.post('/reset/:id', controller.handleResetPassword);
// router.get('/:id', auth.isAuthenticated(), controller.show);
// router.post('/', controller.create);

exports = module.exports = router;
