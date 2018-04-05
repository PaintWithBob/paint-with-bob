const express = require('express');
const router = express.Router();
const async = require('async');

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
	if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
        res.status(401).send('It seems like our fields are missing. It looks like we will have to just paint some new ones.');
        return;
    }

    if(req.body.password.length <= 5) {
        res.status(406).send('Coming up with a password longer than five characters can be hard. But remember: Believe that you can do it cause you can do it.');
        return;
    }

    if (!req.body.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        res.status(401).send('Send an actual email and try again. Don\'t worry, we\'ll wait for you.');
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

router.post('/login', function(req, res) {
    if (!req.body || !req.body.email || !req.body.password) {
        res.status(400).send('Uh Oh, We had a happy little accident.');
        return;
    }
    if (!req.body.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        res.status(400).send('Send an actual email and try again. Don\'t worry, we\'ll wait for you.');
        return;
    }

    var userEmail = req.body.email;
    var userPassword = req.body.password;


    const doesUserExist = async () => {

        const user = await User.findOne({
            email: userEmail
        }).lean(); // Same thing as toJSON()

        if (!user){ //check for the user, return it if it exists, add ! in final version
            throw {
                status: 400,
                message: "Uh oh, someone doesn\'t exist. Once you exist, we will be here for you, because everyone needs a friend."
            }
        }

        return user;
    }

    const verifyPasswd = async (user) => {

        const userPasswd = Buffer.from(userPassword);
        const variedSync = pwd.verifySync(userPasswd, Buffer.from(user.hash));
        return variedSync === SecurePassword.VALID ? true : false;

    }

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
                status: 401,
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

router.get('/myUser', (req, res, next) => {
    // Check header or url parameters or post parameters for token
    var token = req.headers['authorization'] || req.body.token || req.query.token;
    return async.waterfall([
        (callback) => {
            // Make sure token was sent.
            if (!token) {
                return callback({status: 400, message: 'Token not found.'});
            }
            return callback();
        }, (callback) => {
            // Validate the token.
            return TokenService.validateToken(token).then(tokenUser => {
                if(!tokenUser) {
                    return callback({status: 400, message: 'Invalid token.'});
                }
                return callback(null, tokenUser);
            }, error => {
                return callback(error);
            });
        }, (tokenUser, callback) => {
            return User.findOne({_id: tokenUser._id}, (error, user) => {
                if(error) return callback(error);
                if(!user) return callback("User not found");
                return callback(null, user);
            });
        }
    ], (error, user) => {
        if(error) {
            return next(error);
        }
        return res.status(200).json(user);
    });
});

// Update the user by ID. req.body should have whatever attributes the user is trying to update.
router.put('/:userId', (req, res, next) => {

    const data = req.body;
    // Check header or url parameters or post parameters for token
    var token = req.headers['authorization'] || req.body.token || req.query.token;
    return async.waterfall([
        (callback) => {
            // Make sure data was sent.
            if (!data) {
                return callback({status: 400, message: 'Uh Oh, We had a happy little accident.'});
            }
            // Check for proper email format.
            if (req.body.email && !req.body.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                return callback({status: 400, message: 'Send an actual email and try again. Don\'t worry, we\'ll wait for you.'});
            }
            return callback();
        }, (callback) => {
            // Make sure token was sent.
            if (!token) {
                return callback({status: 400, message: 'User not authorized to update resource.'});
            }
            // Validate the token.
            return TokenService.validateToken(token).then(user => {
                if(!user) {
                    return callback({status: 400, message: 'Invalid token.'});
                }
                return callback(null, user);
            }, error => {
                return callback(error);
            });
        }, (tokenUser, callback) => {
            // Check if token ID matches ID of requested resource.
            if(tokenUser._id !== req.params.userId) {
                return callback({status: 400, message: "User not authorized to update resource."});
            }
            return callback(null, tokenUser);
        }, (tokenUser, callback) => {
            return User.findOne({ email: req.body.email }, (error, user) => {
                if(user && (user.id != req.params.userId)) {
                    return callback({status: 409, message: 'Email address is already taken. Please choose another one.'})
                }
                return callback();
            });
        }, (callback) => {
            return User.findOneAndUpdate({ _id: req.params.userId }, data, { new: true })
            .select('-hash -__v').exec((error, updatedUser) => {
                if(error) return callback(error);
                return callback(null, updatedUser);
            });
        }
    ], (error, updatedUser) => {
        if(error) {
            return res.status(error.status).send(error.message);
        }
        return res.status(200).json(updatedUser);
    });

});

router.delete('/:userId', (req, res, next) => {
    // Check header or url parameters or post parameters for token
    var token = req.headers['authorization'] || req.body.token || req.query.token;
    async.waterfall([
        (callback) => {
            if(!req.params.userId) {
                return callback({status: 400, message: 'No user ID found.'});
            }
            if(!token) {
                return callback({status: 400, message: 'User not authorized to update resource.'});
            }
            return callback();
        }, (callback) => {
            // Validate the token.
            return TokenService.validateToken(token).then(tokenUser => {
                if(!tokenUser) {
                    return callback({status: 400, message: 'Invalid token.'});
                }
                return callback(null, tokenUser);
            }, error => {
                return callback(error);
            });
        }, (tokenUser, callback) => {
            // Check if token ID matches ID of requested resource.
            if(tokenUser._id !== req.params.userId) {
                return callback({status: 400, message: "User not authorized to update resource."});
            }
            return callback();
        }, (callback) => {
            return User.findOne({_id: req.params.userId}, (error, user) => {
                if(error) return callback({status: 400, message: 'No user found with matching ID.', error: error});
                if(!user) return callback({status: 400, message: 'No user found with matching ID'});
                return callback(null, user);
            });
        }, (user, callback) => {
            return User.remove({_id: user.id}, (error) => {
                if(error) return callback({status: 400, message: 'Error deleting user.'});
                return callback();
            });
        }
    ], error => {
        if(error) return res.status(error.status).send(error.message);
        return res.status(200).json({message: 'Successfully deleted user.'});
    })
});

module.exports = router;
