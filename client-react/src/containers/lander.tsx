import React, { useState } from 'react'
import { Button, Card, Elevation, Overlay } from '@blueprintjs/core'
import { JoinOverlay } from '../components/join-overlay'
import { CreateOverlay } from '../components/create-overlay'
import { RouteComponentProps } from 'react-router'
import { api } from '../api/ws'

export function Lander(props: RouteComponentProps) {
  const [joinOverlayActive, setJoinOverlay] = useState<boolean>(false)
  const [createOverlayActive, setCreateOverlay] = useState<boolean>(false)
  return (
    <div>
      <Overlay isOpen={joinOverlayActive} onClose={() => setJoinOverlay(false)}>
        <JoinOverlay />
      </Overlay>
      <Overlay isOpen={createOverlayActive} onClose={() => setCreateOverlay(false)}>
        <CreateOverlay
          onSubmit={(topics) => {
            api.createRoom(topics).then((roomID) => {
              props.history.push(`/room/${roomID}`)
            })
          }}
        />
      </Overlay>
      <Card elevation={Elevation.TWO}>
        <Button icon="log-in" onClick={() => setJoinOverlay(true)}>Join</Button>
        <Button icon="add" onClick={() => setCreateOverlay(true)}>Create</Button>
      </Card>
    </div>
  );
}
