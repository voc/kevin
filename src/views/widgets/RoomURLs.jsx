import 'styles/views/widgets/roomURLs.scss'
import React from 'react'
import PropTypes from 'prop-types'
import { serialize } from 'js/url'

const RoomLink = ({ roomid, width }) => {
  const query = serialize({
    roomid,
    width
  })
  const url = `/view?${query}`

  if (width) {
    return (
      <p>
        VIEW URL OBS ({width}p): <a href={url} target='_blank' rel='noreferrer'>{url}</a>
      </p>
    )
  } else {
    return (
      <p>
        VIEW URL: <a href={url} target='_blank' rel='noreferrer'>{url}</a>
      </p>
    )
  }
}
RoomLink.propTypes = {
  roomid: PropTypes.string.isRequired
}

const JoinLink = ({ roomid }) => {
  const url = `view.html?${serialize({ roomid })}`
  return (
    <p>
      Join URL: <a href={url} target='_blank' rel='noreferrer'>{url}</a>
    </p>
  )
}
JoinLink.propTypes = {
  roomid: PropTypes.string.isRequired
}

const RoomURLs = ({ roomid, source }) => (
  <div className='roomURLs'>
    <h3>Share URLs:</h3>
    {source === 'group' && <JoinLink roomid={roomid} />}
    <RoomLink roomid={roomid} />
    <RoomLink roomid={roomid} width={360} />
    <RoomLink roomid={roomid} width={720} />
    <RoomLink roomid={roomid} width={1080} />
  </div>
)
RoomURLs.propTypes = {
  roomid: PropTypes.string.isRequired,
  source: PropTypes.string
}

export default RoomURLs
