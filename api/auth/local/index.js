'use strict';

var express = require('express');
var passport = require('passport');
var setUserReturnObject = require('../../user/user.controller').setUserReturnObject;

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) {
      return res.status(401).json({error: error});
    }
    if (!user) {
      return res.status(404).json({error:{message: 'Something went wrong, please try again.'}});
    }
    res.json(setUserReturnObject(user));
  })(req, res, next)
});

// router.post('/', function(req, res){
//   console.log(req.header)
//   // next();
// });

module.exports = router;
