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
    const { roomid, record } = this.props
    const { devices } = this.state

    this.connection = new Connection({
      mode: Mode.WEBCAM,
      record: record,
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
    const { roomid, record } = this.props
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
            : <VideoContainer record={record} decorations />}
          {showRoomURLs && <RoomURLs roomid={roomid} />}
        </div>
      </div>
    )
  }
}

WebcamShare.propTypes = {
  roomid: PropTypes.string,
  record: PropTypes.bool
}

export default connect((props, state) => {
  props.set('roomid', state.getIn(['params', 'roomid']))
  props.set('record', state.get(['params', 'record']))
})(WebcamShare)
