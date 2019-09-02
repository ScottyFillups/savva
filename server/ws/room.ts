import * as shortid from 'shortid'
import { topic, topicState } from '../../shared/types'

type topicCallback = (t: topic|null, roomID: string) => void

export class Room {
  private id: string
  private topics: topic[]
  private index: number
  private cb: topicCallback
  private prevStartTime: Date|null

  constructor(topics: topic[], cb: topicCallback) {
    this.id = shortid.generate()
    this.topics = topics
    this.index = -1
    this.cb = cb
    this.prevStartTime = null
  }

  start() {
    if (this.index === -1) {
      this.next()
    }
  }

  getIdentifier() {
    return this.id
  }

  getState(): topicState|null {
    if (this.index === -1 || !this.prevStartTime) {
      return null
    }
    const now = new Date()
    const secondDiff = (now.getTime() - this.prevStartTime.getTime()) / 1000
    return {
      topic: this.topics[this.index],
      elapsed: secondDiff
    }
  }

  private next() {
    this.index += 1
    this.prevStartTime = new Date()
    const newTopic = this.topics.length <= this.index ? null : this.topics[this.index]
    this.cb(newTopic, this.id)
    if (newTopic !== null) {
      setTimeout(() => {
        this.next()
      }, newTopic.time * 1000)
    }
  }
}
