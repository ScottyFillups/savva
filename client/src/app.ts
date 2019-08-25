import * as Peer from 'simple-peer'
import io from 'socket.io-client'
import { topic } from '../../shared/types'

interface Socket {
  on: (event: string, callback: (...data: any[]) => void) => void;
  emit: (event: string, ...data: any[]) => void;
}

if (window.location.hostname === 'localhost') {
  run(`ws://${window.location.hostname}:8080`)
} else {
  // Fetch an opaque response to wake up the dyno
//  window.fetch(`https://${config.app.host}`, { mode: 'no-cors' })
//    .then(() => run(`wss://${config.app.host}`))
//    .catch(() => console.error('Signalling server failed to send response'))
}

function registerHandlers(socket: Socket) {
  const createButton: HTMLButtonElement | null = document.querySelector('#create')
  if (!createButton) {
    throw new Error('cannot find create button')
  }
  createButton.onclick = () => createRoom(socket, []).then(console.log)
}

function createRoom(socket: Socket, topics: topic[]): Promise<string> {
  socket.emit('create', topics)
  return new Promise((resolve) => {
    socket.on('created', (roomID: string) => {
      resolve(roomID)
    })
  })
}

function run (wsUrl: string) {
  const socket = io(wsUrl)
  const peers: { [id:string]:Promise<Peer.Instance|void>; } = {}
  const mediaPromise = getMedia({
    audio: true
  }).catch(() => console.error('failed to get media'))

  socket.on('joined', (socketID: string) => {
    peers[socketID] = createPeer(socket, socketID, mediaPromise, true)
  })

  socket.on('signalled', (socketID: string, data: any) => {
    peers[socketID] = createPeer(socket, socketID, mediaPromise, false)
  })

  socket.on('left', (socketID: string) => {
    peers[socketID].then((peer) => {
      if (peer) {
        destroyPeer(socketID, peer)
      }
    })
  })

  registerHandlers(socket)
}

function getMedia (constraints: any) {
  return navigator.mediaDevices.getUserMedia(constraints)
}

function destroyPeer (targetID: string, peer: Peer.Instance) {
  const audio = document.querySelector(`#${targetID}`)
  if (audio && audio.parentNode) {
    audio.parentNode.removeChild(audio)
  }
  peer.destroy()
}

function createPeer (socket: Socket, targetID: string, mediaPromise: Promise<MediaStream|void>, initiator: boolean) {
  return mediaPromise.then((stream) => {
    if (!stream) {
      return
    }
    const peer = new Peer({ initiator, stream })
    peer.on('signal', data => {
      socket.emit('signal', targetID, data)
    })
    peer.on('stream', appendAudio.bind(null, targetID))
    return peer
  })
}

function appendAudio (id: string, stream: MediaStream) {
  const audio = document.createElement('audio')

  // TODO(scotty): Remove the append, return DOM
  document.body.appendChild(audio)
  audio.id = id
  try {
    audio.srcObject = stream
  } catch (error) {
    console.error(error)
    audio.src = URL.createObjectURL(stream)
  }
  audio.play()

  return stream
}
