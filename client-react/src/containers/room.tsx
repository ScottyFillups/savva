import React from 'react'
import { RouteComponentProps } from 'react-router'

export interface RoomProps extends RouteComponentProps {
  roomID: string
}

export function Room(props: RoomProps) {
  return (
    <div>{props.roomID}</div>
  )
}
