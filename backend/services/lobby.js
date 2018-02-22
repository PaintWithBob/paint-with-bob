// Service to create all required events for a connection
const TokenService = require('./token');
const LobbyService = {};

const MAX_USERS_IN_ROOM = 4;

// Define our kick reason constants
const ROOM_FULL='ROOM_FULL';
const INVALID_TOKEN='INVALID_TOKEN';


//Maybe not query param
LobbyService.addListenersToRoom = (socketIoRoom, rooms, roomId) => {
  socketIoRoom.on('connection', (socket) => {
    const token = socket.handshake.query.token;

    // Validate token
    TokenService.validateToken(token).then((user) => {

      // Check if the room is full
      if (rooms[roomId].usersInRoom.length > MAX_USERS_IN_ROOM) {
        LobbyService.kickUser(socket, socket.id, ROOM_FULL, "The room is currently full");
      }

      rooms[roomId].usersInRoom.push({
          user: user,
          socketId: socket.id
      })

      console.log(`${roomId} Connected Event:`, rooms);

      // Handle disconnecitons as well
      socket.on('disconnect', () => {
        let userIndex = -1;
        rooms[roomId].usersInRoom.some((element, index) => {
          if(element.socketId === socket.id) {
            userIndex = index;
            return true;
          }
          return false;
        })

        if(userIndex > -1) {
          rooms[roomId].usersInRoom.splice(userIndex,1)
        }

        // Emit a disconnect event to users

        console.log(`${roomId} Disconnect Event:`, rooms);
      });

    }).catch((error) => {
      console.log(error);
      LobbyService.kickUser(socket, socket.id, INVALID_TOKEN, error.message);
    })
  });
}

LobbyService.kickUser = (socket, userSocketId, reasonId, message) => {
  // Emit the disconnect event
  socket.broadcast.to(userSocketId).emit('kick', {
    reason: reasonId,
    message: message
  });
}

module.exports = LobbyService;
