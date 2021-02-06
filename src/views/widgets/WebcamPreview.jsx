import 'styles/views/widgets/webcamPreview.scss'
import React from 'react'
import PropTypes from 'prop-types'

class WebcamPreview extends React.PureComponent {
  constructor () {
    super()
    this.videoRef = React.createRef()
    this.vumeterRef = React.createRef()
    this.handleStart = this.handleStart.bind(this)
    this.handleSource = this.handleSource.bind(this)
    this.state = {
      audioDevices: [],
      videoDevices: []
    }
  }

  componentDidMount () {
    this.restartStream()
  }

  componentWillUnmount () {
    this.stopStream()
  }

  restartStream () {
    const { audioSource, videoSource } = this.state
    const constraints = {
      audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
      video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    }
    this.stopStream()
    console.log('use constraints', constraints)
    navigator.mediaDevices.getUserMedia(constraints)
      .then(this.handleStream.bind(this))
      .then(this.handleDevices.bind(this))
      .catch(this.handleError.bind(this))
  }

  stopStream () {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop()
      })
      this.stream = null
    }
  }

  handleStream (stream) {
    this.stream = stream
    const video = this.videoRef.current
    const vumeter = this.vumeterRef.current
    if (!video || !vumeter) { return }

    let maxLevelL = 0
    let oldLevelL = 0
    this.audioContext = new AudioContext()
    const microphone = this.audioContext.createMediaStreamSource(stream)
    const scriptNode = this.audioContext.createScriptProcessor(1024, 1, 1)
    const drawCtx = vumeter.getContext('2d')

    video.srcObject = stream
    microphone.connect(scriptNode)
    scriptNode.connect(this.audioContext.destination)

    scriptNode.onaudioprocess = function (event) {
      const inputL = event.inputBuffer.getChannelData(0)
      let instantL = 0

      let sumL = 0
      for (let i = 0; i < inputL.length; ++i) {
        sumL += inputL[i] * inputL[i]
      }
      instantL = Math.sqrt(sumL / inputL.length)
      maxLevelL = Math.max(maxLevelL, instantL)
      instantL = Math.max(instantL, oldLevelL - 0.008)
      oldLevelL = instantL

      drawCtx.clearRect(0, 0, vumeter.width, vumeter.height)
      drawCtx.fillStyle = '#28a745'
      drawCtx.fillRect(0, 0, vumeter.width * (instantL / maxLevelL), vumeter.height) // x,y,w,h
    }

    return navigator.mediaDevices.enumerateDevices()
  }

  handleDevices (devices) {
    if (!devices) { return }

    const audioDevices = []
    const videoDevices = []

    devices.forEach(device => {
      switch (device.kind) {
        case 'audioinput':
          audioDevices.push({
            label: device.label || `microphone ${audioDevices.length + 1}`,
            id: device.deviceId
          })
          break
        case 'videoinput':
          videoDevices.push({
            label: device.label || `camera ${videoDevices.length + 1}`,
            id: device.deviceId
          })
          break
        case 'audiooutput':
        case 'videooutput':
          break
        default:
          console.log('Some other kind of source/device: ', device)
      }
    })

    this.setState({ audioDevices, videoDevices })
  }

  handleError (error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name)
    if (error.name === 'NotAllowedError') {
      this.setState({ error: 'No devices found. Please check browser permissions for audio/video devices.' })
    } else {
      this.setState({ error: `${error.name}: ${error.message}` })
    }
  }

  handleSource (event) {
    this.setState({ [event.target.name]: event.target.value }, this.restartStream.bind(this))
  }

  handleStart () {
    const { onSelect } = this.props
    const { videoSource, audioSource } = this.state
    onSelect({ video: videoSource, audio: audioSource })
  }

  render () {
    const { videoSource, audioSource, error, audioDevices, videoDevices } = this.state
    return (
      <div className='webcamPreview'>
        {!!error &&
          <div className='alert alert-danger' role='alert'>
            {error}
          </div>}
        <div className='d-flex justify-content-center'>
          <h5>Select Device</h5>
        </div>
        <div id='container-preview'>
          <div className='d-flex justify-content-center'>
            <video playsInline autoPlay ref={this.videoRef} width='640' />
          </div>
          <div className='form-row'>
            <div className='form-group col-md-6'>
              <label htmlFor='videoSource'>
                Video source:
              </label>
              <select name='videoSource' className='form-control' value={videoSource} onChange={this.handleSource}>
                {videoDevices.map(dev => <option value={dev.id} key={dev.id}>{dev.label}</option>)}
              </select>
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='audioSource'>
                Audio source:
              </label>
              <select name='audioSource' className='form-control' value={audioSource} onChange={this.handleSource}>
                {audioDevices.map(dev => <option value={dev.id} key={dev.id}>{dev.label}</option>)}
              </select>
              <div className='vumeterWrap'>
                <canvas className='vumeter' ref={this.vumeterRef} />
              </div>
            </div>
          </div>
          <div className='d-flex justify-content-center' />
        </div>
        <div className='d-flex justify-content-center'>
          <button type='button' className='btn btn-primary' onClick={this.handleStart}>Start Stream</button>
        </div>
      </div>
    )
  }
}

WebcamPreview.propTypes = {
  onSelect: PropTypes.func.isRequired
}

export default WebcamPreview
