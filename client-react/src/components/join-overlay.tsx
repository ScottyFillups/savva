import React, { useState } from 'react'
import { H1, Button, Card, FormGroup, InputGroup } from '@blueprintjs/core'
import { baseProps } from '../../../shared/types'
import c from 'classnames'
import './_join-overlay.scss'

export interface JoinOverlayProps extends baseProps {
  onSubmit: (roomID: string) => void
}

export function JoinOverlay(props: JoinOverlayProps) {
  const [ code, setCode ] = useState<string>('')
  return (
    <Card className={c('join-overlay', props.className)}>
      <H1>Join a room</H1>
      <FormGroup
        label="Invitation code"
        labelFor="join-input"
      >
        <InputGroup onChange={(e: any) => setCode(e.target.value)} id="join-input" placeholder="PPBqWA9" />
      </FormGroup>
      <Button onClick={() => props.onSubmit(code)}>Submit</Button>
    </Card>
  )
}
