import React from 'react'
import { RouteComponentProps } from 'react-router'
import { api } from '../api/ws'

export interface RoomProps extends RouteComponentProps<{
  roomID: string
}> {}

export function Room(props: RoomProps) {
  const { roomID } = props.match.params
  api.joinRoom(roomID).then(console.log).catch(console.error)
  return (
    <div>
      <p>{props.match.params.roomID}</p>
    </div>
  )
}
