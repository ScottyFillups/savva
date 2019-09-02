import { Room } from './room'
import { topic } from '../../shared/types'
import { Namespace, Socket } from 'socket.io'

export function wsInit (io: Namespace) {
  const roomMapping: { [key:string]:Room; } = {}
  const topicCallback = (topic: topic|null, roomID: string) => {
    io.in(roomID).emit('topic change', topic)
  }

  io.on('connection', (socket) => {
    register(socket, 'create', (topics: topic[]) => {
      const room = new Room(topics, topicCallback)
      const roomID = room.getIdentifier()
      roomMapping[roomID] = room
      socket.emit('created', roomID)
    })

    register(socket, 'join', (address) => {
      const room = roomMapping[address]
      if (room) {
        socket.join(address)
        socket.emit('snapshot', room.getState())
        socket.to(address).emit('joined', socket.id)
      } else {
        socket.emit('snapshot', null)
      }
    })

    register(socket, 'start', (address) => {
      const room = roomMapping[address]
      if (room) {
        room.start()
      }
    })

    // TODO(scotty): Add proper clean up
    register(socket, 'leave', (address) => {
      socket.leave(address)
      socket.to(address).emit('left', socket.id)
    })
  })
}

function register(socket: Socket, event: string, cb: (...args: any) => void) {
  socket.on(event, (...args: any) => {
    console.log(`${(new Date()).toISOString()} => [${event.toUpperCase()}] ID: ${socket.id}`)
    cb(...args)
  })
}
