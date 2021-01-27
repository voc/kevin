import React from 'react'
// const screenShare = () => {
//   window.addEventListener('beforeunload', function (e) {
//     e.preventDefault()
//     e.returnValue = ''
//   })
//   disableInputButtons()
//   connection.sdpConstraints.mandatory = {
//     OfferToReceiveAudio: false,
//     OfferToReceiveVideo: false
//   }
//   connection.session = {
//     screen: true,
//     oneway: true
//   }

//   connection.open(document.getElementById('room-id').value, function (isRoomExist, roomid, error) {
//     if (error) {
//       disableInputButtons(true)
//       alert(error)
//     } else if (connection.isInitiator === true) {
//       showRoomURL(roomid)
//     }
//   })
//   params.source = 'screen'
// }

const ScreenShare = () => (
  <div />
)
export default ScreenShare
