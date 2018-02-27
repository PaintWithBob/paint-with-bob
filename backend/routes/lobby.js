const express = require('express');
const router = express.Router();
const TokenService = require('../services/token');
const LobbyService = require('../services/lobby');

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

// Task for creating lobbies
// Wrap in an async to allow await
const createLobbyTask = async (res, token) => {
  try {

    // Verfiy the token
    const user = await TokenService.validateToken(token);

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
    // TODO: if guest, owner undefined
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

/* POST create a new lobby. */
router.post('/create', function(req, res, next) {
  // Check the required fields
  if (!req.body ||
      !req.body.token) {
    res.status(400).send('It seems like our fields are missing. It looks like we will have to just paint some new ones.');
    return;
  }

  // Kick off our async task
  createLobbyTask(res, req.body.token);
});

// Lobby Joining and creation for guests
router.get('/guest', function(req, res, next) {
  // TODO: Find a non-private room
  // TODO: Create a room for the guest
});

module.exports = (importedSocketIo) => {
  socketIo = importedSocketIo;
  return router;
};
