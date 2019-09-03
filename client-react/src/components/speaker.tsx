import React from 'react'
import randomColor from 'randomcolor'
import './_speaker.scss'

export interface SpeakerProps {
  id: string
  stream: MediaStream
}

export interface SpeakerState {
  on: boolean
}

export class Speaker extends React.Component<SpeakerProps, SpeakerState> {
  private color: string

  constructor(props: SpeakerProps) {
    super(props)
    this.state = { on: false }
    this.color = randomColor({ seed: props.id })

    const audioCtx = new AudioContext()
    const source = audioCtx.createMediaStreamSource(props.stream)
    const analyser = audioCtx.createAnalyser()
    const audioData = new Uint8Array(analyser.frequencyBinCount)
    analyser.fftSize = 1024
    source.connect(analyser)

    setInterval(() => {
      analyser.getByteTimeDomainData(audioData)
      if (audioData[0] > 128) {
        this.setState({ on: true })
      } else {
        this.setState({ on: false })
      }
    }, 100)
  }

  render() {
    const style: React.CSSProperties = {
      backgroundColor: this.color
    }
    if (this.state.on) {
      style.border = '10px solid #1ddc0f'
    }
    return (
      <div className="speaker" style={style}>
        {this.props.children}
      </div>
    )
  }
}
