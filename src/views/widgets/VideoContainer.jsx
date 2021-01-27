import 'styles/views/widgets/videoContainer.scss'
import React from 'react'
import PropTypes from 'prop-types'
import RecordingControl from 'views/RecordingControl'

const VideoContainer = React.forwardRef(({ record, isLoading, decorations }, ref) => (
  <>
    <div className={'videoContainer ' + (decorations ? 'decorations' : '')} ref={ref}>
      {decorations && isLoading && <div className='spinner-border' />}
    </div>
    {record && <RecordingControl />}
  </>
))

VideoContainer.propTypes = {
  record: PropTypes.bool,
  isLoading: PropTypes.bool,
  decorations: PropTypes.bool
}
VideoContainer.displayName = 'VideoContainer'

export default VideoContainer
