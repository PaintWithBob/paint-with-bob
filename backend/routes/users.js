const express = require('express');
const router = express.Router();

// Get passwords
const securePassword = require('secure-password');
// Initialise our password policy
const pwd = securePassword();

//JWTs
const jwt = require('jsonwebtoken');

// Mongoose requirements
const mongoose = require('mongoose');
const User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Join User
router.post('/join', function(req, res) {

  //Get the required fields
	if (!req.body ||
		!req.body.email ||
		!req.body.password) {
		res.status(401).send('Uh Oh, Something went wrong. Missing Fields');
	}

  const userEmail = req.body.email;
	const userPass = req.body.password;


  // https://javascript.info/async-await
  const findIfUserAlreadyExists = async () => {
    const user = await User.findOne({
		    email: userEmail
    });

    if(user) {
      throw new Error('User Already Exists, please login');
    }

    throw new Error("yoooo");
    return true;
  }

  findIfUserAlreadyExists().then(() => {
    res.send('respond with a resource');
  }).catch((err) => {;
    res.send(err.message);
  });
});

module.exports = router;
