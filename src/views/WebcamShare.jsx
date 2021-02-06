import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'aredux/lib/react'
import Connection, { Mode } from 'js/Connection'
import WebcamPreview from 'views/widgets/WebcamPreview'
import VideoContainer from 'views/widgets/VideoContainer'
import RoomURLs from 'views/widgets/RoomURLs'

class WebcamShare extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      selectDevice: true,
      showRoomURLs: false
    }
    this.containerRef = React.createRef()
    this.startStream = this.startStream.bind(this)
    this.handleDeviceSelect = this.handleDeviceSelect.bind(this)
  }

  handleDeviceSelect (devices) {
    this.setState({
      selectDevice: false,
      devices: devices
    }, this.startStream)
  }

  startStream () {
    const { roomid } = this.props
    const { devices } = this.state

    this.connection = new Connection(this.containerRef.current, {
      mode: Mode.WEBCAM,
      audioDevice: devices.audio,
      videoDevice: devices.video
    })

    this.connection.open(roomid, (roomExists, roomid, error) => {
      const state = { error, isLoading: false }
      if (this.connection.isInitiator()) {
        state.showRoomURLs = true
      }
      this.setState(state)
    })
  }

  componentWillUnmount () {
    if (this.connection) {
      this.connection.close()
    }
  }

  render () {
    const { roomid } = this.props
    const { selectDevice, showRoomURLs, error } = this.state
    return (
      <div className='bg-light'>
        <div className='container'>
          {!!error &&
            <div className='alert alert-danger' role='alert'>
              {error}
            </div>}
          {selectDevice
            ? <WebcamPreview onSelect={this.handleDeviceSelect} />
            : <VideoContainer ref={this.containerRef} />}
          {showRoomURLs && <RoomURLs roomid={roomid} />}
        </div>
      </div>
    )
  }
}

WebcamShare.propTypes = {
  roomid: PropTypes.string
}

export default connect((props, state) => {
  props.set('roomid', state.get('roomid'))
})(WebcamShare)
