'use strict';

var Router = require('express').Router;
var controller = require('./user.controller');
var auth = require('../auth/auth.service');

var router = new Router();

router.post('/', controller.signup);
// router.put('/:id/activate', controller.activate);
router.post('/reset', controller.handleResetRequest);
router.post('/reset/:id', controller.handleResetPassword);

router.put('/:id/setting', auth.hasRole('user'), controller.updateUser);

router.get('/', auth.hasRole('admin'), controller.getUsers);
router.get('/:id', auth.hasRole('admin'), controller.getUser);
router.put('/:id', auth.hasRole('admin'), controller.updateUserAdmin);
exports = module.exports = router;