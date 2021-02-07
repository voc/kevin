import 'styles/views/widgets/recordingControl.scss'
import React from 'react'
import PropTypes from 'prop-types'
import { formatDuration } from 'js/util'
import { connect } from 'aredux/lib/react'
import { stopRecording } from 'js/actions/recording'

class RecordingControl extends React.PureComponent {
  constructor () {
    super()
    this.updateTime = this.updateTime.bind(this)
    this.state = {
      now: 0
    }
  }

  componentWillUnmount () {
    if (this.timeout) { console.log('clear timeout'); clearTimeout(this.timeout) }
  }

  updateTime () {
    this.setState({ now: Date.now() })
  }

  componentDidUpdate (prevProps) {
    const { recording } = this.props
    if (recording.active) {
      this.timeout = setTimeout(this.updateTime, 1000)
    }
  }

  render () {
    const { dispatch, recording } = this.props
    const duration = formatDuration((this.state.now - recording.started) / 1000)
    return (
      <div className='recordingControl'>
        <div className='col-md-4 text-center'>
          {recording.active ? `Recording ${recording.streams} streams` : 'Recording stopped'}
        </div>
        <div className='col-md-4 text-center'>
          {recording.active && <>Recording Duration: {duration}</ >}
        </div>
        <div className='col-md-4 text-center'>
          {recording.active && (
            <button className='btn btn-primary' type='button' onClick={() => dispatch(stopRecording())}>
              Stop Recording
            </button>
          )}
        </div>
      </div>
    )
  }
}

RecordingControl.propTypes = {
  recording: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect((props, state) => {
  props.set('recording', state.getIn(['params', 'recording']))
})(RecordingControl)
