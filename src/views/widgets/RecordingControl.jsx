import React from 'react'
import PropTypes from 'prop-types'
import { formatDuration } from 'js/util'
import { connect } from 'aredux/lib/react'
import { stopRecording } from 'js/actions/recording'

// recordingStatus.innerHTML = 'Recording ' + connection.recorder.streams.length + ' streams';

// (function looper () {
//   // if (!recorder) {
//   //   return
//   // }

//   // recordingtime.innerHTML = 'Recording Duration: ' + calculateTimeDuration()

//   setTimeout(looper, 1000)
// })()

class RecordingControl extends React.PureComponent {
  constructor () {
    super()
    this.updateTime = this.updateTime.bind(this)
    this.state = {
      now: 0
    }
  }

  componentWillUnmount () {
    if (this.timeout) { clearTimeout(this.timeout) }
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
      <>
        <div className='row'>
          <div className='col-lg-4 align-self-center mx-auto'>
            {recording.active ? `Recording ${recording.streams} streams` : 'Recording stopped'}
          </div>
          <div className='col-lg-4 align-self-center mx-auto'>
            {recording.active && <>Recording Duration: {duration}</ >}
          </div>
          <div className='col-lg-4 align-self-center mx-auto'>
            <button className='btn btn-primary' type='button' onClick={() => dispatch(stopRecording())}>
              Stop Recording
            </button>
          </div>
        </div>
      </>
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
