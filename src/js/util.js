
export const generateRoomId = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const idsize = 8
  let id = ''
  for (let i = 0; i < idsize; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// export const getRoomID = () => {
//   let roomid = generateRoomId()
//   console.log('roomid gen: ' + roomid)

//   // overwrite with hash
//   var hashString = location.hash.replace('#', '')
//   if (hashString.length && hashString.indexOf('comment-') === 0) {
//     hashString = ''
//   } else if (hashString.length) {
//     roomid = hashString
//   }

//   // overwrite with url param
//   // const params = getURLParams()
//   // if (params.roomid) {
//   //   roomid = params.roomid
//   // }

//   return roomid
// }

// export const getURLParams = (function () {
//   // const regexp = /([^&=]+)=?([^&]*)/g
//   // const decode = s => decodeURIComponent(s.replace(/\+/g, ' '))
//   // return () => {
//   //   const params = {}
//   //   let match; const search = window.location.search
//   //   while ((match = regexp.exec(search.substring(1)))) {
//   //     params[decode(match[1])] = decode(match[2])
//   //   }
//   //   return params
//   // }
//   return url.deserialize(location.search)
// }())

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
