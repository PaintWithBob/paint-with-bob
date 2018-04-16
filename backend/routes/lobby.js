const express = require('express');
const router = express.Router();
const TokenService = require('../services/token');
const LobbyService = require('../services/lobby');

// Socket IO will be passed in by www, and used from there
let socketIo = {};
const rooms = {};
const roomObjectSchema = {
    isPrivate: false,
    roomName: '',
    usersInRoom: [],
    owner: false,
    socketIoRoom: false,
    shouldDelete: false
}

// Constant for how often to check rooms for deletion in milli
// 10 minutes
const ROOM_DELETE_INTERVAL = 600000;

// Task for creating lobbies
// Wrap in an async to allow await
const createLobbyTask = async (req, res, token) => {
    try {

        // Verfiy the token
        let user = undefined;
        if(token) {
            user = await TokenService.validateToken(token);
        }

        // Get a roomId
        let roomId = (Math.random() * 100).toString(36).substring(7);
        while (rooms[roomId]) {
            roomId = (Math.random() * 100).toString(36).substring(7);
        }

        // Define room ID
        // Using JSONParse/stringify for deep clone
        // https://medium.com/@tkssharma/objects-in-javascript-object-assign-deep-copy-64106c9aefab
        rooms[roomId] = JSON.parse(JSON.stringify(roomObjectSchema));

        // Set room name
        if(req.body.roomName) {
            rooms[roomId].roomName = req.body.roomName;
        } else {
            rooms[roomId].roomName = req.body.roomId;
        }

        if(req.body.isPrivate) {
            rooms[roomId].isPrivate = true;
        }

        const socketIoRoom = socketIo.of('/lobby/room/' + roomId);
        LobbyService.addListenersToRoom(socketIoRoom, rooms, roomId);

        // Populate our room properties
        if (user) {
            rooms[roomId].owner = user._id;
        }
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
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'] || req.body.token || req.query.token;
    if (!token) {
        res.status(400).send('It seems like our fields are missing. It looks like we will have to just paint some new ones.');
        return;
    }

    // Kick off our async task
    createLobbyTask(req, res, token);
});

// Lobby Joining and creation for guests
router.get('/guest', function(req, res, next) {

    // Search all rooms for a non-private room
    // If a non-private room is found, send that to the user
    const foundRoom = Object.keys(rooms).some((roomId) => {
        if(!rooms[roomId].isPrivate && rooms[roomId].usersInRoom.length < 4) {
            res.status(200).json({
                roomId: roomId
            });
            return true;
        }
        return false;
    });

    // Check if we did not find a room
    if (!foundRoom) {
        // Kick off our async task
        createLobbyTask(req, res);
    }
});

// Interval to continually check if we should delete a room
// Since API can just create rooms without requiring a socket connection
// This is required
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
