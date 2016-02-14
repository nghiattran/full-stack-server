'use strict';

var Router = require('express').Router;
var controller = require('./user.controller')
// import * as auth from '../../auth/auth.service';

var router = new Router();
router.get('/', function(req, res) {
	res.render('user.html');
})
// router.post('/', controller.signup);

// router.get('/', auth.hasRole('admin'), controller.index);
// router.delete('/:id', auth.hasRole('admin'), controller.destroy);
// router.get('/me', auth.isAuthenticated(), controller.me);
// router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
// router.get('/:id', auth.isAuthenticated(), controller.show);
// router.post('/', controller.create);

exports = module.exports = router;
