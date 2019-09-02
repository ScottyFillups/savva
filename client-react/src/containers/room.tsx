import React from 'react'
import { RouteComponentProps } from 'react-router'
import { H1, H3, Button, Card } from '@blueprintjs/core'
import { topic, topicState } from '../types'
import { api } from '../api/ws'

export interface RoomProps extends RouteComponentProps<{
  roomID: string
}> {}

interface roomState {
  started: boolean,
  topic: topic|null,
  remaining: number,
  streams: MediaStream[],
}

export class Room extends React.Component<RoomProps, roomState>{
  componentDidMount() {
    setInterval(() => {
      const { remaining } = this.state
      if (remaining > 0) {
        this.setState({ remaining: remaining - 1 })
      }
    }, 1000)
    api.initialize({
      onStream: (targetID: string, stream: MediaStream) => {
        this.setState({ streams: this.state.streams.concat([stream]) })
      },
      onTopicUpdate: (newTopic: topic | null) => {
        this.setState({
          started: true,
          topic: newTopic,
        })
        if (newTopic) {
          this.setState({ remaining: newTopic.time })
        }
      },
      onDestroy: console.log
    })
    api.joinRoom(this.props.match.params.roomID)
      .then((state: topicState) => {
        console.log(state)
        this.setState({ started: state.started })
        if (state.topic && state.elapsed) {
          this.setState({
            remaining: state.topic.time - state.elapsed,
            topic: state.topic
          })
        }
      })
      .catch(console.error)
  }

  constructor(props: RoomProps) {
    super(props)
    this.state = {
      streams: [],
      topic: null,
      started: false,
      remaining: 0
    }
  }

  render() {
    const { started, streams } = this.state
    return (
      <Card>
        {(streams.map((stream, i) => (
          <audio
            key={i}
            ref={(audio) => {
              if (audio) {
                audio.srcObject = stream
                audio.play()
              }
            }}
          ></audio>
        )))}
        { started ? this.renderStarted() : this.renderInactive() }
      </Card>
    )
  }  

  private renderStarted = () => {
    const { topic, remaining } = this.state

    return (
      <div>
        <H3>{topic ? topic.title : 'That\'s all folks!'}</H3>
        <H1>{this.formatRemaining(remaining)}</H1>
      </div>
    )
  }

  private renderInactive = () => {
    const { roomID } = this.props.match.params

    return (
      <div>
        <Button onClick={() => this.handleStart(roomID)}>Start</Button>
      </div>
    )
  }

  private formatRemaining(remaining: number): string {
    const rounded = Math.floor(remaining)
    const seconds = rounded % 60
    const minutes = Math.floor(rounded / 60) % 60
    const hours = Math.floor(rounded / 3600)

    return [
      this.padWithZero(hours),
      this.padWithZero(minutes),
      this.padWithZero(seconds)
    ].join(':')
  }

  private padWithZero(x: number): string {
    if (x < 10) {
      return '0' + String(x)
    }
    return String(x)
  }

  private handleStart(roomID: string) {
    api.start(roomID)
  }
}
