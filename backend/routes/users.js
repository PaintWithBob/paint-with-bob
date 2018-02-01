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


    //======================

    const doesUserExist = async () => {

      const user = await User.findOne({

        email: userEmail

      });

      if (!user){ //check for the user, return it if it exists, add ! in final version
        console.log("7")
        throw {
          status: 400,
          message: "Uh oh, someone doesn\'t exist. Once you exist, we will be here for you, because everyone needs a friend."
        }
      }

      return user;

    }

    //============================================
      const hashPassword = async (user) => {

        const userPasswd = Buffer.from(userPassword);

        const hash = pwd.hashSync(userPasswd);
        if (!hash){
          throw {
            status: 500,
            message: "We messed up and couldn\'t hash your password. I hope you can forgive us for this happy little accident."
          }

        }

        return hash;

      }


    //===========================================



    const verifyPasswd = async () => {

      const passwdHash = await hashPassword();
      const variedSync = pwd.verifySync(userPassword, passwdHash);

      return variedSync.VALID ? true : false;

    }


    //==============================================

    const loginUser = async () => {

      const due = await doesUserExist();
      if (!due){
        throw {
          status: 500,
          message: "The user doesn\'t seem to exist. Don\'t worry, we\'ll wait for them."
        }
      }

      const vp = await verifyPasswd();
      if(!vp){
        throw {
          status: 500,
          message: "Sometimes in life, your password doesn\'t verify. That\'s ok. Sometimes you need the darkness along with the light, to make you appreciate the good times."
        }
      }

      return jwt.sign(user, "", {

        expiresIn: '7 days'

      });

    }

    //====================================
      loginUser().then(
        (response) => {
          res.status(200).send(response);
        }
      ).catch(
        (error) => {
          res.status(error.status).send(error.message);
        }
      );


});

module.exports = router;
