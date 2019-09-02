import React, { useState } from 'react'
import { Button, Card, Elevation, Overlay } from '@blueprintjs/core'
import { JoinOverlay } from '../components/join-overlay'
import { CreateOverlay } from '../components/create-overlay'
import { api } from '../api/ws'

export function Lander() {
  const [joinOverlayActive, setJoinOverlay] = useState<boolean>(false)
  const [createOverlayActive, setCreateOverlay] = useState<boolean>(false)
  return (
    <div>
      <Overlay isOpen={joinOverlayActive} onClose={() => setJoinOverlay(false)}>
        <JoinOverlay />
      </Overlay>
      <Overlay isOpen={createOverlayActive} onClose={() => setCreateOverlay(false)}>
        <CreateOverlay onSubmit={topics => api.createRoom(topics).then(console.log)} />
      </Overlay>
      <Card elevation={Elevation.TWO}>
        <Button icon="log-in" onClick={() => setJoinOverlay(true)}>Join</Button>
        <Button icon="add" onClick={() => setCreateOverlay(true)}>Create</Button>
      </Card>
    </div>
  );
}
