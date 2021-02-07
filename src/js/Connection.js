import io from 'socket.io-client'
import EventEmitter from 'events'
import RTCMultiConnection from 'rtcmulticonnection'
import RecordRTC from 'recordrtc'
import DetectRTC from 'detectrtc'
import { getVideoConstraints, getSDPHandler } from 'js/Codecs'
import kevinConfig from 'js/config'
import store from 'js/store'
import { addStream, removeStream } from 'js/actions/stream'
import { startRecording } from 'js/actions/recording'

// Globally expose libraries for rtcmulti... js like it's 2005 \o/
window.io = io

// TODO: move to some kind of config
const bitrate = 512
const resolution = 'Ultra-HD' // probably unneeded
const preferredCodec = 'vp8'
const iceServers = ['stun:kevin.c3voc.de:3479']

export const Mode = Object.freeze({
  ROOM: Symbol('room'),
  VIEW: Symbol('view'),
  WEBCAM: Symbol('webcam'),
  SCREEN: Symbol('screen')
})

/**
 * RTCMultiConnection wrapper
 * Currently connections objects can't be reused reliably!
 */
export default class Connection extends EventEmitter {
  constructor (config) {
    super()
    this.config = config = Object.assign({}, config)
    this.mode = config.mode || Mode.ROOM
    this.closed = false
    this.mediaElement = null
    this.connection = new RTCMultiConnection()

    // setup connection settings
    const connection = this.connection
    connection.socketURL = kevinConfig.backendURL
    connection.socketMessageEvent = kevinConfig.backendEvent
    connection.session = {
      audio: true,
      video: true
    }
    connection.mediaConstraints = {
      video: getVideoConstraints(resolution),
      audio: true
    }
    connection.processSdp = getSDPHandler(connection.CodecsHandler, bitrate, preferredCodec)

    connection.iceServers = [{
      urls: iceServers
    }]

    // offer to receive streams
    connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: this.mode === Mode.ROOM || this.mode === Mode.VIEW,
      OfferToReceiveVideo: this.mode === Mode.ROOM || this.mode === Mode.VIEW
    }

    // force devices
    if (config.audioDevice) {
      connection.mediaConstraints.audio = {
        deviceId: config.audioDevice
      }
    }

    if (config.videoDevice) {
      connection.mediaConstraints.video = {
        deviceId: config.videoDevice
      }
    }

    // Set oneway mode if we are not in a group chat
    if (this.mode === Mode.VIEW || this.mode === Mode.WEBCAM) {
      connection.session = {
        audio: true,
        video: true,
        oneway: true
      }
    } else if (this.mode === Mode.SCREEN) {
      connection.session = {
        screen: true,
        oneway: true
      }
    }

    // setup connection handlers
    connection.onstream = (event) => {
      // Wrap with try-catch because RTCMulti just drops our errors on the floor m(
      try {
        this.handleStream(event)
      } catch (err) {
        console.error(err)
        throw err
      }
    }
    connection.onleave = this.handleLeave.bind(this)
    connection.onMediaError = this.handleMediaError.bind(this)
    connection.onbeforeunload = () => {}

    // bind connection methods
    this.open = connection.open.bind(connection)
    this.openOrJoin = connection.openOrJoin.bind(connection)
    this.checkPresence = connection.checkPresence.bind(connection)
  }

  // Join conference as stream receiver
  join (roomid) {
    this.connection.join(roomid)
  }

  handleStream (event) {
    console.log('got stream', event.mediaElement, event.type)

    event.mediaElement.removeAttribute('src')
    event.mediaElement.removeAttribute('srcObject')
    event.mediaElement.muted = true
    event.mediaElement.volume = 0
    delete event.mediaElement

    // to keep room-id in cache
    // localStorage.setItem(connection.socketMessageEvent, connection.sessionid);

    event.mode = this.mode
    event.width = this.config.width
    store.dispatch(addStream(event))

    if (this.config.record) {
      this.startRecording(event.stream)
    }

    if (event.type === 'local') {
      this.connection.socket.on('disconnect', () => {
        if (!this.connection.getAllParticipants().length) {
          location.reload()
        }
      })
    }
  }

  // Called when peer stream ends
  handleLeave ({ userid }) {
    store.dispatch(removeStream(userid))
  }

  handleMediaError (error) {
    if (error.message === 'Concurrent mic process limit.') {
      if (DetectRTC.audioInputDevices.length <= 1) {
        alert('Please select external microphone. Check github issue number 483.')
        return
      }

      var secondaryMic = DetectRTC.audioInputDevices[1].deviceId
      this.connection.mediaConstraints.audio = {
        deviceId: secondaryMic
      }

      this.connection.join(this.connection.sessionid)
    }

    console.error('media error', error)
  }

  startRecording (stream) {
    let recorder = this.connection.recorder
    if (!recorder) {
      this.connection.recorder = recorder = RecordRTC([stream], {
        type: 'video',
        disableLogs: false,
        video: {
          width: 1920,
          height: 1080
        }
      })
      recorder.startRecording()
    } else {
      recorder.getInternalRecorder().addStreams([stream])
    }

    store.dispatch(startRecording())

    // subscribe for recording stop
    const unsubscribe = store.subscribe((state) => {
      if (!state.getIn(['recording', 'active'])) {
        console.log('stopped recording')
        recorder.stopRecording(function () {
          const blob = recorder.getBlob()
          RecordRTC.invokeSaveAsDialog(blob)
        })
        unsubscribe()
      }
    })
  }

  joinRoomIfExists (roomid) {
    return new Promise((resolve, reject) => {
      this.connection.checkPresence(roomid, (roomExists) => {
        if (!roomExists) { reject(new Error('Room not found')) }

        if (this.mode === Mode.VIEW) {
          this.connection.join(roomid)
          resolve()
        } else {
          this.connection.openOrJoin(roomid)
          resolve()
        }
      })
    })
  }

  close () {
    const connection = this.connection
    const mPeer = connection.multiPeersHandler
    this.closed = true
    connection.peers.getAllParticipants().forEach(function (participant) {
      mPeer.onNegotiationNeeded({
        userLeft: true
      }, participant)

      if (connection.peers[participant] && connection.peers[participant].peer) {
        connection.peers[participant].peer.close()
      }

      delete connection.peers[participant]
    })
    if (connection.socket) {
      connection.socket.disconnect()
    }
    connection.isInitiator = false
  }

  isInitiator () {
    return this.connection.isInitiator
  }
}
