import React, { useState } from 'react'
import { topic } from '../../../shared/types'
import c from 'classnames'
import { H1, H4, Button, Card, ControlGroup, FormGroup, InputGroup, NumericInput, Tag } from '@blueprintjs/core'
import { baseProps } from '../../../shared/types'
import "./_create-overlay.scss"

interface validationResult {
  isSuccess: boolean;
  reason: string;
}

function validateTopic(name: string, time: number): validationResult {
  if (isNaN(time)) {
    return {
      isSuccess: false,
      reason: 'Topic time must be a number'
    }
  }
  if (time < 1) {
    return {
      isSuccess: false,
      reason: 'Topic time must be greater than 0'
    }
  }
  if (name === '') {
    return {
      isSuccess: false,
      reason: 'Topic title must not be empty'
    }
  }
  return {
    isSuccess: true,
    reason: ''
  }
}

export interface ChangeOverlayProps extends baseProps {
  onSubmit(topics: topic[]): void;
}

export function CreateOverlay(props: ChangeOverlayProps) {
  const [topics, setTopics] = useState<topic[]>([])
  const [topicTitle, setTopicTitle] = useState<string>('')
  const [topicTime, setTopicTime] = useState<number>(15)

  return (
    <Card className={c('create-overlay', props.className)}>
      <H1>Create a room</H1>
      <FormGroup
        label="Name"
        labelFor="name-input"
      >
        <InputGroup id="name-input" placeholder="Billy Bob" />
      </FormGroup>
      <FormGroup
        label="Add topic"
        labelFor="topic-input"
      >
        <ControlGroup id="topic-input">
          <InputGroup
            value={topicTitle}
            placeholder="scottyfillups.io/savva?r=PPBqWA9"
            onChange={(e: any) => {
              setTopicTitle(e.target.value)
            }}
          />
          <NumericInput
            value={topicTime}
            placeholder="Enter topic time in minutes"
            onValueChange={(valueAsNumber: number, valueAsString: string) => {
              setTopicTime(valueAsNumber)
            }}
          />
        </ControlGroup>
        <Button
          icon="arrow-right"
          onClick={() => {
            const validationResult = validateTopic(topicTitle, topicTime)
            if (validationResult.isSuccess) {
              const newTopic: topic = {
                title: topicTitle,
                time: topicTime
              }
              setTopics(topics.concat([newTopic]))
              setTopicTime(15)
              setTopicTitle('')
            } else {
              console.error(validationResult.reason)
            }
          }}
        >
          Add topic
        </Button>
      </FormGroup>
      <div>
        {topics.map((topicValue, i) => (
          <Card key={i}>
            <Tag>{topicValue.time} minutes</Tag>
            <H4>{topicValue.title}</H4>
          </Card>
        ))}
      </div>
      <Button
        onClick={() => {
          props.onSubmit(topics)
          setTopics([])
        }}
      >
        Submit
        </Button>
    </Card>
  )
}
