
export function getVideoConstraints (resolution) {
  return {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    frameRate: 30
  }
}

export function getSDPHandler (codecHandler, bitrate, preferredCodec) {
  return (sdp) => {
    if (preferredCodec) {
      sdp = codecHandler.preferCodec(sdp, preferredCodec.toLowerCase())
    }

    sdp = codecHandler.setApplicationSpecificBandwidth(sdp, {
      audio: 128,
      video: bitrate,
      screen: bitrate
    })

    sdp = codecHandler.setVideoBitrates(sdp, {
      min: bitrate * 8 * 1024,
      max: bitrate * 8 * 1024
    })
    return sdp
  }
}
