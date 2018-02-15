const express = require('express');
const router = express.Router();
const socketIO = require('socket.io')(http);
const rooms = {};


/* GET users listing. */
router.post('/create', function(req, res, next) {

  //Get the required fields
  if (!req.body ||
      !req.body.token ) {
    res.status(400).send('It seems like our fields are missing. It looks like we will have to just paint some new ones.');
    return;
  }

let roomID = (Math.random() * 100).toString(36).substring(7);
while (rooms[roomID]) {
  roomID = (Math.random() * 100).toString(36).substring(7);
}
//Define room ID
rooms[roomID] = {};
const socketIORoom = socketIO.of('/lobby/room/' + roomID);
//to do: handle connection and shit

  res.status(200).json({roomID: roomID});
});


module.exports = router;
