//JWTs
const jwt = require('jsonwebtoken');

const tokenSecret = process.env.TOKEN_SECRET || (Math.random() * 100).toString(36).substring(7);

const TokenService = {};

TokenService.getToken = (user) => {
  const getTokenTask = async () => {
    try {
      const token = jwt.sign(user, tokenSecret);

      if (!token) {
        throw {
          status: 500,
          message: 'Token came back undefined.',
          error: false
        }
      }

      return token;
    } catch(error) {
      return await Promise.reject({
        status: error.status || 500,
        message: error.message || 'Internal Server Error'
      });
    }
  };

  return getTokenTask();
};

TokenService.validateToken = (token) => {
  const validateTokenTask = async () => {
    try {
      const user = jwt.verify(token, tokenSecret);

      if (!user) {
        throw {
          status: 401,
          message: 'Invalid Token',
          error: false
        }
      }

      return user;
    } catch(error) {
      return await Promise.reject({
        status: error.status || 500,
        message: error.message || 'Internal Server Error'
      });
    }
  }

  return validateTokenTask();
};

module.exports = TokenService;
