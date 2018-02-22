// Service to create all required events for a connection
const TokenService = require('./token');
const LobbyService = {};

// Constants for a lobby
const MAX_USERS_IN_ROOM = 4;

// Canvas
const CANVAS_EVENT = {
  EVENT_ID: 'CANVAS_UPDATE',
}

// Chat
const CHAT_EVENT = {
  EVENT_ID: 'CHAT_MESSAGE'
}

// Room
const ROOM_EVENT = {
  EVENT_ID: 'ROOM_UPDATE',
  REASON: {
    USER_JOINED: 'USER_JOINED',
    USER_LEFT: 'USER_LEFT'
  }
}

// Kick Event constants
const KICK_EVENT = {
  EVENT_ID: 'KICK',
  REASON: {
    INVALID_TOKEN: 'INVALID_TOKEN',
    ROOM_FULL: 'ROOM_FULL'
  }
}


// Function to intialize a room on connection
// Maybe not query param
LobbyService.addListenersToRoom = (socketIoRoom, rooms, roomId) => {
  socketIoRoom.on('connection', (socket, socketIoRoom, rooms, roomId) => {
    connectionEventHandler(socket, socketIoRoom, rooms, roomId)
  });
}

// Function to kick a user from a room
LobbyService.kickUser = (socket, userSocketId, reasonId, message) => {
  // Emit the disconnect event
  socket.broadcast.to(userSocketId).emit(KICK_EVENT.EVENT_ID, {
    reason: reasonId,
    message: message
  });
}

// Function to get a room object for a user, will delete server specific attributes
LobbyService.getRoomForClient = (room) => {
  // Make a copy of the room
  const clientRoom = Object.assign({}, room);

  // Remove unwanted keys from the schema, see routes/lobby.js
  delete clientRoom.socketIoRoom
  delete clientRoom.shouldDelete
}

// Socket.io on connection handler
const connectionHandler = (socket, socketIoRoom, rooms, roomId) => {
  const token = socket.handshake.query.token;

  // Validate token
  TokenService.validateToken(token).then((user) => {

    // Check if the room is full
    if (rooms[roomId].usersInRoom.length > MAX_USERS_IN_ROOM) {
      LobbyService.kickUser(socket, socket.id, KICK_EVENT.REASON.ROOM_FULL, "The room is currently full");
    }

    // Add the user to the room
    rooms[roomId].usersInRoom.push({
        user: user,
        socketId: socket.id
    });

    // Let everyone know that a user has joined
    socketIoRoom.emit(ROOM_EVENT.EVENT_ID, {
      reason: ROOM_EVENT.REASON.USER_JOINED,
      room: LobbyService.getRoomForClient(rooms[roomId])
    });

    console.log(`${roomId} Connected Event:`, rooms);

    // Handle disconnections as well
    socket.on('disconnect', () => {
      disconnectEventHandler(rooms);
    });

  }).catch((error) => {
    console.log(error);
    LobbyService.kickUser(socket, socket.id, KICK_EVENT.REASON.INVALID_TOKEN, error.message);
  });
}

const disconnectEventHandler() = (rooms) => {

  // Get the user index
  let userIndex = -1;
  rooms[roomId].usersInRoom.some((element, index) => {
    if(element.socketId === socket.id) {
      userIndex = index;
      return true;
    }
    return false;
  });

  // Remove the user if we found them
  if(userIndex > -1) {
    rooms[roomId].usersInRoom.splice(userIndex, 1)

    // Let everyone know that a user has left
    socketIoRoom.emit(ROOM_EVENT.EVENT_ID, {
      reason: ROOM_EVENT.REASON.USER_LEFT,
      room: LobbyService.getRoomForClient(rooms[roomId])
    });

    // Emit a disconnect event to users
    console.log(`${roomId} Disconnect Event:`, rooms);
  }
}

module.exports = LobbyService;
