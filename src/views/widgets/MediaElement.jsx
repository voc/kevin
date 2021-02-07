import React from 'react'
import PropTypes from 'prop-types'
import getHTMLMediaElement from 'js/getHTMLMediaElement'
import { Mode } from 'js/Connection'

class MediaElement extends React.PureComponent {
  constructor () {
    super()
    this.ref = React.createRef()
  }

  componentDidMount () {
    const { stream } = this.props
    this.mediaElement = this.createMediaElement(stream)
    this.ref.current.appendChild(this.mediaElement)

    // TODO: do something cleverer than delayed play. maybe check
    // whether the user interacted with the app first or similar
    if (stream.type === 'remote') {
      setTimeout(() => {
        this.mediaElement.media.play().catch((err) => {
          console.error(err)
        })
      }, 5000)
    }
  }

  componentWillUnmount () {
    if (this.mediaElement) {
      console.log(this.mediaElement.media, this.mediaElement.stop)
      this.ref.current.removeChild(this.mediaElement)
    }
  }

  createMediaElement (stream) {
    const video = document.createElement('video')

    try {
      video.setAttributeNode(document.createAttribute('autoplay'))
      video.setAttributeNode(document.createAttribute('playsinline'))
    } catch (e) {
      video.setAttribute('autoplay', true)
      video.setAttribute('playsinline', true)
    }

    if (stream.type === 'local') {
      video.volume = 0
      try {
        video.setAttributeNode(document.createAttribute('muted'))
      } catch (e) {
        video.setAttribute('muted', true)
      }
    }
    video.srcObject = stream.stream

    let mediaElement
    switch (stream.mode) {
      case Mode.VIEW:
        mediaElement = getHTMLMediaElement(video, {
          buttons: [''],
          width: stream.width,
          showOnMouseEnter: false
        })
        break
      case Mode.WEBCAM:
        try {
          video.setAttributeNode(document.createAttribute('controls'))
        } catch (e) {
          video.setAttribute('controls', true)
        }
        mediaElement = getHTMLMediaElement(video, {
          buttons: ['full-screen'],
          showOnMouseEnter: true
        })
        break
      case Mode.SCREEN:
        mediaElement = getHTMLMediaElement(video, {
          buttons: ['full-screen'],
          showOnMouseEnter: true
        })
        break
      default: {
        // const width = parseInt(clientWidth / 3) - 20
        mediaElement = getHTMLMediaElement(video, {
          title: stream.userid,
          buttons: ['full-screen'],
          // width: width,
          showOnMouseEnter: true
        })
      }
    }
    return mediaElement
  }

  render () {
    return <div ref={this.ref} />
  }
}

MediaElement.propTypes = {
  stream: PropTypes.object
}

export default MediaElement
