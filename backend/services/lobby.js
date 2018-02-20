// Service to create all required events for a connection
const TokenService = require('./token');
const LobbyService = {};


//Maybe not query param
LobbyService.addListenersToRoom = (socketIoRoom, rooms, roomId) => {
  socketIoRoom.on('connection', (socket) => {
    console.log('someone connected');
    const token = socket.query.token;
    TokenService.validateToken(token).then((user) => {
      rooms[roomId].usersInRoom.push({
          user: user,
          socketId: socket.id;
      })
    })
  })
  socketIoRoom.on('disconnect', (socket) => {
    let userIndex = -1;
    rooms[roomId].usersInRoom.some((element, index) => {
      if(element.socketId === socket.id) {
        userIndex = index;
        return true;
      }
      return false;
    })
    if(userIndex > -1) {
      rooms{roomId].usersInRoom.splice(userIndex,1)
    }
  })



}

module.exports = LobbyService;
