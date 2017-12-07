// Basic error handling function.
function basicError(message, status) {
  var error = new Error();
  error.status = status;
  error.message = message;
  return error;
};

// Error handling
function sendError(err, res) {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

function callback(error, retval) {
  if(error) {
      return error;
  }
  return retval;
}

// Response handling
function response(data, message, status) {
  if(!status) {
    status = 200;
  }
  return {
    status: status,
    data: data,
    message: message
  }
};

const helpers = {
  basicError: basicError,
  sendError: sendError,
  callback: callback,
  response: response
}

module.exports = helpers;