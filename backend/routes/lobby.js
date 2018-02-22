const express = require('express');
const router = express.Router();
const TokenService = require('../services/token');
const LobbyService = require('../services/lobby');

// Constant for how often to check rooms for deletion in milli
// 10 minutes
const ROOM_DELETE_INTERVAL = 600000;

// Socket IO will be passed in by www, and used from there
let socketIo = {};
const rooms = {};
const roomObjectSchema = {
  isPrivate: false,
  usersInRoom: [],
  owner: false,
  socketIoRoom: false,
  shouldDelete: false
}

/* POST create a new lobby. */
router.post('/create', function(req, res, next) {
  // Check the required fields
  if (!req.body ||
      !req.body.token) {
    res.status(400).send('It seems like our fields are missing. It looks like we will have to just paint some new ones.');
    return;
  }

  // Wrap in an async to allow await
  const createLobbyTask = async () => {
    try {
      // Verfiy the token
      const user = await TokenService.validateToken(req.body.token);

      // Get a roomId
      let roomId = (Math.random() * 100).toString(36).substring(7);
      while (rooms[roomId]) {
        roomId = (Math.random() * 100).toString(36).substring(7);
      }

      //Define room ID
      rooms[roomId] = Object.assign({}, roomObjectSchema);

      const socketIoRoom = socketIo.of('/lobby/room/' + roomId);
      LobbyService.addListenersToRoom(socketIoRoom, rooms, roomId);

      // Populate our room properties
      rooms[roomId].owner = user._id;
      rooms[roomId].socketIoRoom = socketIoRoom;

      res.status(200).json({
        roomId: roomId
      });
    } catch (error) {
      console.log(error);
      res.status(error.status || 500).json({
        error: error
      });
      return;
    }
  }

  // Kick off our async task
  createLobbyTask();
});

// Interval to continually check if we should delete a room
setInterval(() => {
  Object.keys(rooms).forEach((roomKey) => {
    // Check if we should delete a room
    if (rooms[roomKey].shouldDelete && rooms[roomKey].usersInRoom.length <= 0) {

      // Delete the room because there still are no users
      if (rooms[roomKey].usersInRoom.length <= 0) {
        delete rooms[roomKey];
      } else {
        // Some new users joined, un mark for deletion
        rooms[roomKey].shouldDelete = false;
      }

    } else {

      // Check if we should make for deletion
      if (rooms[roomKey].usersInRoom.length <= 0) {
        rooms[roomKey].shouldDelete = true;
      }
    }
  });
}, ROOM_DELETE_INTERVAL);


module.exports = (importedSocketIo) => {
  socketIo = importedSocketIo;
  return router;
};
