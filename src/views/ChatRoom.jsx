import React from 'react'
import PropTypes from 'prop-types'
import Connection from 'js/Connection'
import RoomURLs from 'views/widgets/RoomURLs'
import VideoContainer from 'views/widgets/VideoContainer'
import { connect } from 'aredux/lib/react'

class ChatRoom extends React.Component {
  constructor () {
    super()
    this.containerRef = React.createRef()
    this.state = {
      isLoading: true
    }
  }

  componentDidMount () {
    const { roomid } = this.props
    this.connection = new Connection(this.containerRef.current)
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
    const { showRoomURLs, error, isLoading } = this.state
    return (
      <div className='bg-light'>
        <div className='container'>
          {!!error &&
            <div className='alert alert-danger' role='alert'>
              {error}
            </div>}
          <VideoContainer ref={this.containerRef} isLoading={isLoading} decorations />
          {showRoomURLs && <RoomURLs roomid={roomid} />}
        </div>
      </div>
    )
  }
}

ChatRoom.propTypes = {
  roomid: PropTypes.string
}

export default connect((props, state) => {
  props.set('roomid', state.get('roomid'))
})(ChatRoom)
