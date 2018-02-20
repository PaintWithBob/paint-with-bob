// Service to create all required events for a connection

const LobbyService = {};

LobbyService.addListenersToRoom = (socketIoRoom, rooms) => {
  room.on('connection', (socket) => {
    console.log('someone connected');
  })

}

module.exports = LobbyService;
