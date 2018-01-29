var express = require('express');
var router = express.Router();

// Get passwords
const securePassword = require('secure-password');
// Initialise our password policy
const pwd = securePassword();

//JWTs
var jwt = require('jsonwebtoken');

// Mongoose requirements
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Join User
router.post('/join', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
