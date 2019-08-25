import { Room } from './room'
import { topic } from '../../shared/types'
import { Namespace } from 'socket.io'

export function wsInit (io: Namespace) {
  const roomMapping: { [key:string]:Room; } = {}
  const topicCallback = (topic: topic|null, roomID: string) => {
    io.in(roomID).emit('topic change', topic)
  }

  io.on('connection', (socket) => {
    socket.on('create', (topics: topic[]) => {
      const room = new Room(topics, topicCallback)
      const roomID = room.getIdentifier()
      socket.join(roomID)
      socket.emit('created', roomID)
    })

    socket.on('join', (address) => {
      socket.join(address)
      socket.to(address).emit('joined', socket.id)
    })

    socket.on('leave', (address) => {
      socket.leave(address)
      socket.to(address).emit('left', socket.id)
    })
  })
}
