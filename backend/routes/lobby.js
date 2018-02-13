const express = require('express');
const router = express.Router();
const rooms = {};

/* GET users listing. */
router.post('/create', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
