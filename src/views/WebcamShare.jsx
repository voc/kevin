import React from 'react'
// const webcamShare = () => {
//     window.addEventListener('beforeunload', function (e) {
//       e.preventDefault()
//       e.returnValue = ''
//     })
//     disableInputButtons()
//     connection.sdpConstraints.mandatory = {
//       OfferToReceiveAudio: true,
//       OfferToReceiveVideo: true
//     }
//     connection.session = {
//       audio: true,
//       video: true,
//       oneway: true
//     }

//     const audioInputSelect = document.querySelector('select#audioSource')
//     const videoSelect = document.querySelector('select#videoSource')
//     const audioSource = audioInputSelect.value
//     const videoSource = videoSelect.value
//     connection.mediaConstraints.audio = {
//       deviceId: audioSource
//     }
//     connection.mediaConstraints.video = {
//       deviceId: videoSource
//     }

//     connection.open(document.getElementById('room-id').value, function (isRoomExist, roomid, error) {
//       if (error) {
//         disableInputButtons(true)
//         alert(error)
//       } else if (connection.isInitiator === true) {
//         showRoomURL(roomid)
//       }
//     })
//     params.source = 'webcam'
//   }
const WebcamShare = () => (
  <div />
)
export default WebcamShare
