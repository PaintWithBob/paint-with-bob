var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Join User
router.post('/join', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
