import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'aredux/lib/react'
import Connection, { Mode } from 'js/Connection'
import VideoContainer from 'views/widgets/VideoContainer'

class ViewStream extends React.Component {
  constructor () {
    super()
    this.state = {}
    this.timeout = null
    this.containerRef = React.createRef()
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
    const { width } = this.props
    this.connection = new Connection(this.containerRef.current, {
      mode: Mode.VIEW,
      width: width
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
    const { width } = this.props
    return (
      <VideoContainer ref={this.containerRef} decorations={!width} />
    )
  }
}

ViewStream.propTypes = {
  roomid: PropTypes.string,
  width: PropTypes.number
}

export default connect((props, state) => {
  props.set('roomid', state.get('roomid'))
  props.set('width', state.get('width'))
})(ViewStream)
