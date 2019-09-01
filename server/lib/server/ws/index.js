"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("./room");
function wsInit(io) {
    const roomMapping = {};
    const topicCallback = (topic, roomID) => {
        io.in(roomID).emit('topic change', topic);
    };
    io.on('connection', (socket) => {
        socket.on('create', (topics) => {
            const room = new room_1.Room(topics, topicCallback);
            const roomID = room.getIdentifier();
            socket.join(roomID);
            socket.emit('created', roomID);
        });
        socket.on('join', (address) => {
            socket.join(address);
            socket.to(address).emit('joined', socket.id);
        });
        socket.on('leave', (address) => {
            socket.leave(address);
            socket.to(address).emit('left', socket.id);
        });
    });
}
exports.wsInit = wsInit;
