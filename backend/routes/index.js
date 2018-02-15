var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let nodeVersion = process.version;
  let nodeTitle = process.title;
  let uptimeArray = process.uptime().toString().split('.');
  let milliseconds = uptimeArray[1];
  let seconds = uptimeArray[0]%60;
  let minutes = Math.floor((uptimeArray[0]/60)%60);
  let hours = Math.floor((uptimeArray[0]/3600)%24);
  let days = Math.floor(uptimeArray[0]/86400);
  res.render('index', {
    title: 'Express',
    nodeVersion: nodeVersion,
    nodeTitle: nodeTitle,
    milliseconds: milliseconds,
    seconds: seconds,
    minutes: minutes,
    hours: hours,
    days: days,
    uptime: process.uptime()
  });
});

module.exports = router;
