import * as Peer from 'simple-peer'
import io from 'socket.io-client'
import { topic, topicState } from '../types'

interface Socket {
  on: (event: string, callback: (...data: any[]) => void) => void;
  emit: (event: string, ...data: any[]) => void;
}

function getMedia (constraints: any) {
  return navigator.mediaDevices.getUserMedia(constraints)
}

export interface SavvaParams {
  onStream: (targetID: string, stream: MediaStream) => void;
  onTopicUpdate: (topic: topic|null) => void;
  onDestroy: (targetID: string) => void;
}

export class SavvaAPI {
  private baseURL: string
  private mediaPromise: Promise<MediaStream|void>
  private socket: Socket
  private peers: { [id:string]:Promise<Peer.Instance|void>; }
  private static instance: SavvaAPI

  public static get Instance() {
    if (!this.instance) {
      this.instance = new this()
    }
    return this.instance
  }

  private constructor() {
    const baseURL = window.location.hostname === 'localhost'
      ? process.env.REACT_APP_DEV_BASE_URL
      : process.env.REACT_APP_PROD_BASE_URL
    this.baseURL = baseURL || ''
    this.mediaPromise = getMedia({ audio: true })
    this.socket = io(this.baseURL)
    this.peers = {}
  }

  public initialize(params: SavvaParams) {
    this.registerSocketEventHandlers(params)
  }

  public start(roomID: string) {
    this.socket.emit('start', roomID)
  }

  public createRoom(topics: topic[]): Promise<string> {
    this.socket.emit('create', topics)
    return new Promise((resolve) => {
      this.socket.on('created', (roomID: string) => {
        resolve(roomID)
      })
    })
  }

  public joinRoom(roomID: string): Promise<topicState> {
    this.socket.emit('join', roomID)
    return new Promise((resolve) => {
      this.socket.on('snapshot', (topicState: topicState|null) => {
        if (topicState) {
          resolve(topicState)
        } else {
          throw new Error('room does not exist')
        }
      })
    })
  }

  private registerSocketEventHandlers(params: SavvaParams) {
    this.socket.on('joined', (socketID: string) => {
      this.peers[socketID] = this.createPeer(socketID, true, params.onStream)
    })

    this.socket.on('signalled', (socketID: string, data: any) => {
      this.peers[socketID] = this.createPeer(socketID, false, params.onStream)
    })

    this.socket.on('topic change', (newTopic: topic|null) => {
      params.onTopicUpdate(newTopic)
    })

    this.socket.on('left', (socketID: string) => {
      this.peers[socketID].then((peer) => {
        if (peer) {
          params.onDestroy(socketID)
          peer.destroy()
        }
      })
    })
  }

  private createPeer (
    targetID: string,
    initiator: boolean,
    onStream: (targetID: string, stream: MediaStream) => void
  ): Promise<Peer.Instance|void> {
    return this.mediaPromise.then((stream) => {
      if (!stream) {
        return
      }
      const peer = new Peer.default({ initiator, stream })
      peer.on('signal', (data: any) => {
        this.socket.emit('signal', targetID, data)
      })
      peer.on('stream', (stream: MediaStream) => {
        onStream(targetID, stream)
      })
      return peer
    })
  }
}

export const api = SavvaAPI.Instance
