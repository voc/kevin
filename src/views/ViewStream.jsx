import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'aredux/lib/react'
import Connection, { Mode } from 'js/Connection'
import VideoContainer from 'views/widgets/VideoContainer'

class ViewStream extends React.PureComponent {
  constructor () {
    super()
    this.state = {}
    this.timeout = null
    this.checkRoomPresence = this.checkRoomPresence.bind(this)
  }

  checkRoomPresence () {
    const { roomid } = this.props
    this.connection.checkPresence(roomid, (roomExists) => {
      if (!roomExists) {
        this.timeout = setTimeout(this.checkRoomPresence, 5000)
        return
      }
      this.connection.join(roomid)
    })
  }

  componentDidMount () {
    const { width, record } = this.props
    this.connection = new Connection({
      mode: Mode.VIEW,
      width: width,
      record: record
    })
    this.checkRoomPresence()
  }

  componentWillUnmount () {
    if (this.timeout) { clearTimeout(this.timeout) }
    if (this.connection) {
      this.connection.close()
    }
  }

  render () {
    const { width, record } = this.props
    return (
      <VideoContainer decorations={!width} record={record} />
    )
  }
}

ViewStream.propTypes = {
  roomid: PropTypes.string,
  width: PropTypes.number,
  record: PropTypes.bool
}

export default connect((props, state) => {
  props.set('roomid', state.getIn(['params', 'roomid']))
  props.set('width', state.getIn(['params', 'width']))
  props.set('record', state.getIn(['params', 'record']))
})(ViewStream)
