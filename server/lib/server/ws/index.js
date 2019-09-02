"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("./room");
function wsInit(io) {
    const roomMapping = {};
    const topicCallback = (topic, roomID) => {
        io.in(roomID).emit('topic change', topic);
    };
    io.on('connection', (socket) => {
        register(socket, 'create', (topics) => {
            const room = new room_1.Room(topics, topicCallback);
            const roomID = room.getIdentifier();
            roomMapping[roomID] = room;
            socket.emit('created', roomID);
        });
        register(socket, 'join', (address) => {
            const room = roomMapping[address];
            if (room) {
                socket.join(address);
                socket.emit('snapshot', room.getState());
                socket.to(address).emit('joined', socket.id);
            }
        });
        register(socket, 'start', (address) => {
            const room = roomMapping[address];
            if (room) {
                room.start();
            }
        });
        register(socket, 'leave', (address) => {
            socket.leave(address);
            socket.to(address).emit('left', socket.id);
        });
    });
}
exports.wsInit = wsInit;
function register(socket, event, cb) {
    socket.on(event, (...args) => {
        console.log(`${(new Date()).toISOString()} => [${event.toUpperCase()}] ID: ${socket.id}`);
        cb(...args);
    });
}
