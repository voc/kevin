import 'styles/views/widgets/videoContainer.scss'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'aredux/lib/react'
import RecordingControl from 'views/widgets/RecordingControl'
import MediaElement from 'views/widgets/MediaElement'

class VideoContainer extends React.PureComponent {
  render () {
    const { record, decorations, streams } = this.props
    return (
      <>
        <div className={'videoContainer ' + (decorations ? 'decorations' : '')}>
          {decorations && Object.keys(streams).length === 0 && <div className='spinner-border' />}
          {Object.values(streams).map(stream => (<MediaElement key={stream.userid} stream={stream} />))}
        </div>
        {record && <RecordingControl />}
      </>
    )
  }
}

VideoContainer.propTypes = {
  record: PropTypes.bool,
  decorations: PropTypes.bool,
  streams: PropTypes.object
}

export default connect((props, state) => {
  props.set('streams', state.get('streams'))
  props.set('record', state.getIn(['params', 'record']))
})(VideoContainer)
