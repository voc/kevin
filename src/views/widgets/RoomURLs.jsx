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
      <>
        View URL OBS ({width}p): <a href={url} target='_blank' rel='noreferrer'>{url}</a><br />
      </>
    )
  } else {
    return (
      <>
        View URL: <a href={url} target='_blank' rel='noreferrer'>{url}</a><br />
      </>
    )
  }
}
RoomLink.propTypes = {
  roomid: PropTypes.string.isRequired
}

const JoinLink = ({ roomid }) => {
  const url = `/chatRoom?${serialize({ roomid })}`
  return (
    <p>
      Join URL: <a href={url} target='_blank' rel='noreferrer'>{url}</a>
    </p>
  )
}
JoinLink.propTypes = {
  roomid: PropTypes.string.isRequired
}

const RoomURLs = ({ roomid, join }) => (
  <div className='roomURLs'>
    <h4>Share URLs:</h4>
    {join && <JoinLink roomid={roomid} />}
    <RoomLink roomid={roomid} />
    <RoomLink roomid={roomid} width={360} />
    <RoomLink roomid={roomid} width={720} />
    <RoomLink roomid={roomid} width={1080} />
  </div>
)
RoomURLs.propTypes = {
  roomid: PropTypes.string.isRequired,
  join: PropTypes.bool
}

export default RoomURLs
