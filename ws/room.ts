import * as shortid from 'shortid'
import { topic } from '../../shared/types'

type topicCallback = (t: topic|null, roomID: string) => void

export class Room {
  private id: string;
  private topics: topic[];
  private index: number;
  private cb: topicCallback;

  constructor(topics: topic[], cb: topicCallback) {
    this.id = shortid.generate()
    this.topics = topics
    this.index = -1
    this.cb = cb
  }

  start() {
    if (this.index === -1) {
      this.next()
    }
  }

  getIdentifier() {
    return this.id
  }

  private next() {
    this.index += 1
    const newTopic = this.topics.length <= this.index ? null : this.topics[this.index]
    this.cb(newTopic, this.id)
    if (newTopic !== null) {
      setTimeout(() => {
        this.next()
      }, newTopic.time * 1000)
    }
  }
}
