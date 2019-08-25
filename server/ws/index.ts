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
      socket.emit('created', room.getIdentifier())
    })

    socket.on('join', (address) => {
      socket.join(address)
      socket.to(address).emit('connected', socket.id)
    })

    socket.on('leave', (address) => {
      socket.leave(address)
      socket.to(address).emit('disconnected', socket.id)
    })
  })
}
