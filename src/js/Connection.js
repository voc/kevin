import io from 'socket.io-client'
import RTCMultiConnection from 'rtcmulticonnection'
import RecordRTC from 'recordrtc'
import { getVideoConstraints, getSDPHandler } from 'js/Codecs'
// import { calculateTimeDuration } from 'js/util'
import getHTMLMediaElement from 'js/getHTMLMediaElement'
import kevinConfig from 'js/config'

// Globally expose libraries for rtcmulti... js like it's 2005 \o/
window.io = io

// TODO: move to some kind of config
const bitrate = 512
const resolution = 'Ultra-HD' // probably unneeded
const preferredCodec = 'vp8'
const iceServers = ['stun:kevin.c3voc.de:3479']

export const Mode = Object.freeze({
  VIEW: Symbol('view'),
  WEBCAM: Symbol('webcam'),
  SCREEN: Symbol('screen')
})

// const mode = Mode.VIEW
const action = ''

/**
 * RTCMultiConnection wrapper
 * Currently connections objects can't be reused reliably!
 */
export default class Connection {
  constructor (container, config) {
    if (!container) {
      throw new Error('Container is required!')
    }
    this.config = config = Object.assign({}, config)
    this.mode = config.mode
    this.closed = false
    this.mediaElement = null
    this.connection = new RTCMultiConnection()

    // setup connection settings
    const connection = this.connection
    connection.videosContainer = container
    connection.socketURL = kevinConfig.backendURL
    connection.socketMessageEvent = kevinConfig.backendEvent
    connection.session = {
      audio: true,
      video: true
    }
    connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    }
    connection.mediaConstraints = {
      video: getVideoConstraints(resolution),
      audio: true
    }
    connection.processSdp = getSDPHandler(connection.CodecsHandler, bitrate, preferredCodec)

    connection.iceServers = [{
      urls: iceServers
    }]

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
    connection.onbeforeunload = () => {}

    // bind connection methods
    this.open = connection.open.bind(connection)
    this.checkPresence = connection.checkPresence.bind(connection)
  }

  // Join conference as stream receiver
  join (roomid) {
    this.connection.session = {
      audio: true,
      video: true,
      oneway: true
    }
    this.connection.join(roomid)
  }

  handleStream (event) {
    console.log('got stream', event.mediaElement, event.type)

    event.mediaElement.removeAttribute('src')
    event.mediaElement.removeAttribute('srcObject')
    event.mediaElement.muted = true
    event.mediaElement.volume = 0

    const video = document.createElement('video')

    try {
      video.setAttributeNode(document.createAttribute('autoplay'))
      video.setAttributeNode(document.createAttribute('playsinline'))
    } catch (e) {
      video.setAttribute('autoplay', true)
      video.setAttribute('playsinline', true)
    }

    if (event.type === 'local') {
      video.volume = 0
      try {
        video.setAttributeNode(document.createAttribute('muted'))
      } catch (e) {
        video.setAttribute('muted', true)
      }
    }
    video.srcObject = event.stream

    let mediaElement
    switch (this.mode) {
      case Mode.VIEW:
        mediaElement = getHTMLMediaElement(video, {
          buttons: [''],
          width: this.config.width,
          showOnMouseEnter: false
        })
        break
      case Mode.WEBCAM:
        try {
          video.setAttributeNode(document.createAttribute('controls'))
        } catch (e) {
          video.setAttribute('controls', true)
        }
        mediaElement = getHTMLMediaElement(video, {
          buttons: ['full-screen'],
          showOnMouseEnter: true
        })
        break
      case Mode.SCREEN:
        mediaElement = getHTMLMediaElement(video, {
          buttons: ['full-screen'],
          showOnMouseEnter: true
        })
        break
      default: {
        const width = parseInt(this.connection.videosContainer.clientWidth / 3) - 20
        mediaElement = getHTMLMediaElement(video, {
          title: event.userid,
          buttons: ['full-screen'],
          width: width,
          showOnMouseEnter: true
        })
      }
    }
    mediaElement.id = event.streamid
    console.log('got mediaElement', mediaElement)
    this.connection.videosContainer.appendChild(mediaElement)
    this.mediaElement = mediaElement
    setTimeout(function () {
      mediaElement.media.play()
    }, 5000)

    console.log('sessionid: ' + this.connection.sessionid)
    // to keep room-id in cache
    // localStorage.setItem(connection.socketMessageEvent, connection.sessionid);

    // chkRecordConference.parentNode.style.display = 'none'

    if (this.config.record) {
      if (!this.connection.recorder.streams) {
        this.connection.recorder.streams = []
      }

      this.connection.recorder.streams.push(event.stream)
      // recordingStatus.innerHTML = 'Recording ' + connection.recorder.streams.length + ' streams';

      // (function looper () {
      //   // if (!recorder) {
      //   //   return
      //   // }

      //   // recordingtime.innerHTML = 'Recording Duration: ' + calculateTimeDuration((new Date().getTime() - dateStarted) / 1000)

      //   setTimeout(looper, 1000)
      // })()
    }

    if (event.type === 'local') {
      this.connection.socket.on('disconnect', () => {
        if (!this.connection.getAllParticipants().length) {
          location.reload()
        }
      })
    }
  }

  startRecording () {
    var recorder = this.connection.recorder
    if (!recorder) {
      recorder = RecordRTC([event.stream], {
        type: 'video',
        disableLogs: false,
        video: {
          width: 1920,
          height: 1080
        }
      })
      recorder.startRecording()
      // dateStarted = new Date().getTime()
      this.connection.recorder = recorder
    } else {
      recorder.getInternalRecorder().addStreams([event.stream])
    }
  }

  joinRoomIfExists (roomid) {
    return new Promise((resolve, reject) => {
      this.connection.checkPresence(roomid, (roomExists) => {
        if (!roomExists) { reject(new Error('Room not found')) }

        if (action && action === 'view') {
          this.connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
          }
          this.connection.session = {
            audio: true,
            video: true,
            oneway: true
          }
          this.connection.join(roomid)
          // disableInputButtonsView()
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

// var recordingtime = document.getElementById('recording-time')
// var recordingStatus = document.getElementById('recording-status')
// var chkRecordConference = document.getElementById('record-entire-conference')
// var btnStopRecording = document.getElementById('btn-stop-recording')
// btnStopRecording.onclick = function () {
//   var recorder = connection.recorder
//   if (!recorder) return alert('No recorder found.')
//   recorder.stopRecording(function () {
//     var blob = recorder.getBlob()
//     invokeSaveAsDialog(blob)

//     connection.recorder = null
//     btnStopRecording.style.display = 'none'
//     recordingStatus.style.display = 'none'
//     chkRecordConference.parentNode.style.display = 'none'
//     recordingtime.style.display = 'none'
//   })
// }

// connection.onstreamended = function (event) {
//   var mediaElement = document.getElementById(event.streamid)
//   if (mediaElement) {
//     mediaElement.parentNode.removeChild(mediaElement)
//   }
// }

// connection.onMediaError = function (e) {
//   if (e.message === 'Concurrent mic process limit.') {
//     if (DetectRTC.audioInputDevices.length <= 1) {
//       alert('Please select external microphone. Check github issue number 483.')
//       return
//     }

//     var secondaryMic = DetectRTC.audioInputDevices[1].deviceId
//     connection.mediaConstraints.audio = {
//       deviceId: secondaryMic
//     }

//     this.connection.join(connection.sessionid)
//   }
// }
