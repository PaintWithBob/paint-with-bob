const express = require('express');
const router = express.Router();


// Get passwords
const SecurePassword = require('secure-password');
// Initialise our password policy
const pwd = SecurePassword();

// Our token service
const TokenService = require('../services/token');

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
    !req.body.username ||
		!req.body.email ||
		!req.body.password) {
		res.status(401).send('It seems like our fields are missing. It looks like we will have to just paint some new ones.');
    return;
	}

  if(req.body.password.length <= 5) {
    res.status(406).send('Coming up with a password longer than five characters can be hard. But remember: Believe that you can do it cause you can do it.');
    return;
  }

  const userEmail = req.body.email;
	const userPass = req.body.password;
  const username = req.body.username;


  // https://javascript.info/async-await
  const findIfUserDoesNotAlreadyExists = async () => {
    const user = await User.findOne({
		    email: userEmail
    });

    if(user) {
      throw {
        status: 409,
        message: 'The user seems to already exist. That\'s ok though. Sometimes even I like to talk to myself.'
      };
    }

    return true;
  }

  const hashUserPassword = async () => {
    const userPasswordBuffer = Buffer.from(userPass);
    const hash = pwd.hashSync(userPasswordBuffer);

    if (!hash) {
      throw {
        status: 500,
        message: "There has been an error with the password hashing. Don\'t panic though, we\'ll find a way through this."
      }
    }

    return hash;
  };

  const createNewUser = async () => {

    try {
      await findIfUserDoesNotAlreadyExists();
      const hash = await hashUserPassword();

      // Create the user
      const user = new User({
        username: username,
        email: userEmail,
        hash: hash.toString()
      });

      // Save the user
      const savedUser = await user.save((err) => {
        if (err) {
						throw {
              status: 500,
              message: "The user hasn\'t been saved. Lets paint them a happy little life saver and fix that problem."
            }
				}
      });

      const savedUserJson = savedUser.toJSON();
      delete savedUserJson.hash;

      const token = await TokenService.getToken(savedUserJson);
      return {
        token: token,
        user: savedUserJson
      };
    } catch(err) {
      console.log(err);
      if(!err || !err.status) {
        throw {
          status: 500,
          message: "We had a happy little accident when we made the user. Let\'s try that again, shall we?"
        };
      } else {
        throw err;
      }
    }
  }

  createNewUser().then((response) => {
    res.status(200).json({
      token: response.token,
      user: response.user
    });
  }).catch((err) => {
    res.status(err.status).send(err.message);
  });

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
      return;
    }

    var userEmail = req.body.email;
    var userPassword = req.body.password;


    //======================

    const doesUserExist = async () => {

      const user = await User.findOne({
        email: userEmail
      }).lean();

      if (!user){ //check for the user, return it if it exists, add ! in final version
        throw {
          status: 400,
          message: "Uh oh, someone doesn\'t exist. Once you exist, we will be here for you, because everyone needs a friend."
        }
      }

      return user;
    }

    //============================================

    /**
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
      **/





    //===========================================



    const verifyPasswd = async (user) => {

      const userPasswd = Buffer.from(userPassword);
      const variedSync = pwd.verifySync(userPasswd, Buffer.from(user.hash));
      return variedSync === SecurePassword.VALID ? true : false;

    }


    //==============================================

    const loginUser = async () => {

      const user = await doesUserExist();
      if (!user){
        throw {
          status: 500,
          message: "The user doesn\'t seem to exist. Don\'t worry, we\'ll wait for them."
        }
      }

      const vp = await verifyPasswd(user);
      if(!vp){
        throw {
          status: 500,
          message: "Sometimes in life, your password doesn\'t verify. That\'s ok. Sometimes you need the darkness along with the light, to make you appreciate the good times."
        }
      }

      delete user.hash;
      const token = await TokenService.getToken(user);
      return {
        token: token,
        user: user
      };
    }

    //====================================
      loginUser().then(
        (response) => {
          res.status(200).json({
            token: response.token,
            user: response.user
          });
        }
      ).catch(
        (error) => {
          if(!error || !error.status) {
            console.log(error);
            res.status(500).send();
            return;
          }
          res.status(error.status).send(error.message);
        }
      );

});

module.exports = router;
