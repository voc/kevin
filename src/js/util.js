
export const generateRoomId = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const idsize = 8
  let id = ''
  for (let i = 0; i < idsize; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

export const formatDuration = (secs) => {
  var hr = Math.floor(secs / 3600)
  var min = Math.floor((secs - (hr * 3600)) / 60)
  var sec = Math.floor(secs - (hr * 3600) - (min * 60))

  if (min < 10) {
    min = '0' + min
  }

  if (sec < 10) {
    sec = '0' + sec
  }

  if (hr <= 0) {
    return min + ':' + sec
  }

  return hr + ':' + min + ':' + sec
}
