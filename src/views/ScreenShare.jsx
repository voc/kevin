import React from 'react'
import PropTypes from 'prop-types'
import Connection, { Mode } from 'js/Connection'
import RoomURLs from 'views/widgets/RoomURLs'
import VideoContainer from 'views/widgets/VideoContainer'
import { connect } from 'aredux/lib/react'

class ScreenShare extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      isLoading: true
    }
  }

  componentDidMount () {
    const { roomid, record } = this.props
    this.connection = new Connection({
      mode: Mode.SCREEN,
      record: record
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
    const { showRoomURLs, error, isLoading } = this.state
    return (
      <div className='bg-light'>
        <div className='container'>
          {!!error &&
            <div className='alert alert-danger' role='alert'>
              {error}
            </div>}
          <VideoContainer isLoading={isLoading} record={record} decorations />
          {showRoomURLs && <RoomURLs roomid={roomid} />}
        </div>
      </div>
    )
  }
}

ScreenShare.propTypes = {
  roomid: PropTypes.string,
  record: PropTypes.bool
}

export default connect((props, state) => {
  props.set('roomid', state.getIn(['params', 'roomid']))
  props.set('record', state.getIn(['params', 'record']))
})(ScreenShare)
