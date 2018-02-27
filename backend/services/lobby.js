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
    USER_LEFT: 'USER_LEFT',
    NEW_OWNER: 'NEW_OWNER'
  }
}

// Kick Event constants
const KICK_EVENT = {
  EVENT_ID: 'KICK',
  REASON: {
    INVALID_TOKEN: 'INVALID_TOKEN',
    ROOM_FULL: 'ROOM_FULL',
    ROOM_DOES_NOT_EXIST: 'ROOM_DOES_NOT_EXIST'
  }
}


// Function to intialize a room on connection
// All events additional events will be conditionally applied by handlers
LobbyService.addListenersToRoom = (socketIoRoom, rooms, roomId) => {
  socketIoRoom.on('connection', (socket) => {
    connectionEventHandler(socket, socketIoRoom, rooms, roomId)
  });
}

// Function to kick a user from a room
LobbyService.kickUser = (socket, userSocketId, reasonId, message) => {
  // Emit the disconnect event
  console.log('hi', reasonId);
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

  return clientRoom;
}

// Socket.io on connection handler
const connectionEventHandler = (socket, socketIoRoom, rooms, roomId) => {

  // Check if the room exitsts
  if(!rooms[roomId]) {
    console.log('hi');
    LobbyService.kickUser(socket, socket.id, KICK_EVENT.REASON.ROOM_DOES_NOT_EXIST, "The room no longer exists.");
    return;
  }

  // Check if the room is full
  if (rooms[roomId].usersInRoom.length > MAX_USERS_IN_ROOM) {
    LobbyService.kickUser(socket, socket.id, KICK_EVENT.REASON.ROOM_FULL, "The room is currently full");
    return;
  }

  const token = socket.handshake.query.token;

  // Validate token
  if(token === undefined) {
    // Pass guest info
    const guestId = `guest#${(Math.random() * 100).toString(36).substring(7)}`;
    addUserToRoom(socket, socketIoRoom, rooms, roomId, {
      _id: guestId,
      email: guestId,
      dateJoined: Date.now()
    });
  } else {
    TokenService.validateToken(token).then((user) => {
      addUserToRoom(socket, socketIoRoom, rooms, roomId, user);
    }).catch((error) => {
      console.log(error);
      LobbyService.kickUser(socket, socket.id, KICK_EVENT.REASON.INVALID_TOKEN, error.message);
    });
  }
}

const addUserToRoom = (socket, socketIoRoom, rooms, roomId, user) => {
  // Add the user to the room
  rooms[roomId].usersInRoom.push({
      user: user,
      socketId: socket.id,
      timeJoined: Date.now()
  });

  // If we don't have an owner, this user is now the owner
  if (!rooms[roomId].owner) {
    rooms[roomId].owner = user._id;
  }


  // Let everyone know that a user has joined
  socketIoRoom.emit(ROOM_EVENT.EVENT_ID, {
    reason: ROOM_EVENT.REASON.USER_JOINED,
    room: LobbyService.getRoomForClient(rooms[roomId])
  });


  // Handle disconnections as well
  socket.on('disconnect', () => {
    disconnectEventHandler(socket, socketIoRoom, rooms, roomId);
  });
};

const disconnectEventHandler = (socket, socketIoRoom, rooms, roomId) => {

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
    // Check if the user is the owner
    if(rooms[roomId].usersInRoom[userIndex].user._id === rooms[roomId].owner &&
      rooms[roomId].usersInRoom.length > 1) {
      // Find the next oldest user
      rooms[roomId].usersInRoom.sort((a, b) => {
        if(a.timeJoined < b.timeJoined) {
          return -1;
        }

        if(a.timeJoined > b.timeJoined) {
          return 1;
        }

        return 0;
      });

      // The new owner will be the first user that is not the current owner in the newly sorted array
      rooms[roomId].usersInRoom.some((user) => {
        if (rooms[roomId].owner !== user._id) {
          rooms[roomId].owner = user._id;
          // Let everyone know that there is a new owner
          socketIoRoom.emit(ROOM_EVENT.EVENT_ID, {
            reason: ROOM_EVENT.REASON.NEW_OWNER,
            owner: user
          });
          return true;
        }
        return false;
      });
    }

    // Remove the user
    rooms[roomId].usersInRoom.splice(userIndex, 1);

    // Check how many rooms are left
    if(rooms[roomId].usersInRoom.length <= 0) {
      // Delete the room
      delete rooms[roomId]
    } else {
      // Let everyone know that a user has left
      socketIoRoom.emit(ROOM_EVENT.EVENT_ID, {
        reason: ROOM_EVENT.REASON.USER_LEFT,
        room: LobbyService.getRoomForClient(rooms[roomId])
      });
    }
  }
}

module.exports = LobbyService;
