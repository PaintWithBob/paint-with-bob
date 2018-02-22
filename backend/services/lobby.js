// Service to create all required events for a connection
const TokenService = require('./token');
const LobbyService = {};


//Maybe not query param
LobbyService.addListenersToRoom = (socketIoRoom, rooms, roomId) => {
  socketIoRoom.on('connection', (socket) => {
    const token = socket.handshake.query.token;

    TokenService.validateToken(token).then((user) => {

      rooms[roomId].usersInRoom.push({
          user: user,
          socketId: socket.id
      })

      console.log(`${roomId} Connected Event:`, rooms);
    }).catch((error) => {
      console.log(error);
      socket.disconnect();
    })

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

      console.log(`${roomId} Disconnect Event:`, rooms);
    });
  });
}

module.exports = LobbyService;
