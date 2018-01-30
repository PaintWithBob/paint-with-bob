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


router.post('/login', function(req //request from the client (browser)
  , res // what we send back to the browser
  ) {

    if (!req.body ||
  		!req.body.email ||
  		!req.body.password) {
  		res.status(400).send('Uh Oh, We had a happy little accident.');
  		return;
  	}
    if (!req.body.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){

      res.status(400).send('Send an actual email and try again. Don\'t worry, we\'ll wait for you.');

    }

    var userEmail = req.body.email
    var userPassword = req.body.password

    User.findOne({
        email: userEmail //look for email (user.js), and use the userEmail (right above) variable for it
    }, function(err, user) {
      if (err || !user){
        res.status(400).send('Uh oh, someone doesn\'t exist. Once you exist, we will be here for you, because everyone needs a friend.');
      }

      const getUser = async () => {

        const user = await User.findOne({ //wait for another promise
          email: userEmail
        });

        if (!user){ //check for the user, return it if it exists
          throw new Error('Uh oh, someone doesn\'t exist. Once you exist, we will be here for you, because everyone needs a friend.')
        }

        return user;
      }

      const hashPassword = async (user) => {

        pwd.hash(userPassword, function (err, hash) {
          if (err) throw err

          //TODO: add hashing


      }

      res.send('Josh, you better friggin go to the taco party');

    });







});

module.exports = router;
