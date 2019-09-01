import React from 'react'
import { H1, Button, Card, FormGroup, InputGroup } from '@blueprintjs/core'
import { baseProps } from '../../../shared/types'
import c from 'classnames'
import './_join-overlay.scss'

export function JoinOverlay(props: baseProps) {
  return (
    <Card className={c('join-overlay', props.className)}>
      <H1>Join a room</H1>
      <FormGroup
        label="Name"
        labelFor="name-input"
      >
        <InputGroup id="name-input" placeholder="Billy Bob" />
      </FormGroup>
      <FormGroup
        label="Invitation link"
        labelFor="join-input"
      >
        <InputGroup id="join-input" placeholder="scottyfillups.io/savva?r=PPBqWA9" />
      </FormGroup>
      <Button>Submit</Button>
    </Card>
  )
}
