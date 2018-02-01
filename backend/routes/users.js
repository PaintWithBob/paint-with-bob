const express = require('express');
const router = express.Router();


// Get passwords
const SecurePassword = require('secure-password');
// Initialise our password policy
const pwd = SecurePassword();

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
  const findIfUserDoesNotAlreadyExists = async () => {
    const user = await User.findOne({
		    email: userEmail
    });

    if(user) {
      throw {
        status: 409,
        message: 'User Already Exists, please login'
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
        message: "Error hashing password"
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
        email: userEmail,
        hash: JSON.stringify(hash)
      });

      // Save the user
      const savedUser = await user.save((err) => {
        if (err) {
						throw {
              status: 500,
              message: "Error saving the user"
            }
				}
      });

      delete savedUser.hash;
      return savedUser;
    } catch(err) {
      console.log(err);
      if(!err || !err.status) {
        throw {
          status: 500,
          message: "Error creating the user"
        };
      } else {
        throw err;
      }
    }
  }

  createNewUser().then((response) => {
    res.status(200).send(response);
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

    }

    var userEmail = req.body.email
    var userPassword = req.body.password


    //======================

    const doesUserExist = async () => {

      const user = await User.findOne({
        email: userEmail
      }).lean();

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
      const userPasswd = Buffer.from(userPassword);
      const variedSync = pwd.verifySync(userPasswd, passwdHash);
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

      const vp = await verifyPasswd();
      if(!vp){
        throw {
          status: 500,
          message: "Sometimes in life, your password doesn\'t verify. That\'s ok. Sometimes you need the darkness along with the light, to make you appreciate the good times."
        }
      }

      console.log(user);
      return jwt.sign(user, "im sorry kyle", {
        expiresIn: '7 days'
      });

    }

    //====================================
      loginUser().then(
        (response) => {
          res.status(200).json({
            token: response
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
