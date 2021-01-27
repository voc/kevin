import React from 'react'
import WebcamPreview from 'views/WebcamPreview'

// $('#preview-webcam').on('shown.bs.modal', function (e) {
//   console.log('starting preview')

//   const videoElement = document.querySelector('#videoPreview')
//   const audioInputSelect = document.querySelector('select#audioSource')
//   const videoSelect = document.querySelector('select#videoSource')
//   const selectors = [audioInputSelect, videoSelect]

//   function gotDevices (deviceInfos) {
//     const values = selectors.map(select => select.value)
//     selectors.forEach(select => {
//       while (select.firstChild) {
//         select.removeChild(select.firstChild)
//       }
//     })
//     for (let i = 0; i !== deviceInfos.length; ++i) {
//       const deviceInfo = deviceInfos[i]
//       const option = document.createElement('option')
//       option.value = deviceInfo.deviceId
//       if (deviceInfo.kind === 'audioinput') {
//         option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`
//         audioInputSelect.appendChild(option)
//       } else if (deviceInfo.kind === 'videoinput') {
//         option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`
//         videoSelect.appendChild(option)
//       } else {
//         console.log('Some other kind of source/device: ', deviceInfo)
//       }
//     }
//     selectors.forEach((select, selectorIndex) => {
//       if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
//         select.value = values[selectorIndex]
//       }
//     })
//   }

//   var maxLevelL = 0
//   var oldLevelL = 0
//   var cnvs = document.getElementById('vumeter')
//   var cnvsCtx = cnvs.getContext('2d')

//   function gotStream (stream) {
//     window.stream = stream
//     videoElement.srcObject = stream

//     var audioContext = new AudioContext()
//     var microphone = audioContext.createMediaStreamSource(stream)
//     var javascriptNode = audioContext.createScriptProcessor(1024, 1, 1)

//     microphone.connect(javascriptNode)
//     javascriptNode.connect(audioContext.destination)
//     javascriptNode.onaudioprocess = function (event) {
//       var inputL = event.inputBuffer.getChannelData(0)
//       var instantL = 0.0

//       var sumL = 0.0
//       for (var i = 0; i < inputL.length; ++i) {
//         sumL += inputL[i] * inputL[i]
//       }
//       instantL = Math.sqrt(sumL / inputL.length)
//       maxLevelL = Math.max(maxLevelL, instantL)
//       instantL = Math.max(instantL, oldLevelL - 0.008)
//       oldLevelL = instantL

//       cnvsCtx.clearRect(0, 0, cnvs.width, cnvs.height)
//       cnvsCtx.fillStyle = '#00ff00'
//       cnvsCtx.fillRect(10, 10, (cnvs.width - 20) * (instantL / maxLevelL), (cnvs.height - 20)) // x,y,w,h
//     }

//     return navigator.mediaDevices.enumerateDevices()
//   }

//   function handleError (error) {
//     console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name)
//     if (error.name === 'NotAllowedError') {
//       // document.getElementById('container-preview').style.display = "none";
//       // document.getElementById('webcam-share').style.display = "none";
//       alert('No devices found. Please check browser permissions for audio/video devices.')
//       window.location.href = 'index.html'
//     }
//   }

//   function start () {
//     if (window.stream) {
//       window.stream.getTracks().forEach(track => {
//         track.stop()
//       })
//     }
//     const audioSource = audioInputSelect.value
//     const videoSource = videoSelect.value
//     const constraints = {
//       audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
//       video: { deviceId: videoSource ? { exact: videoSource } : undefined }
//     }
//     navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError)
//   }

//   navigator.mediaDevices.enumerateDevices().then(gotDevices)
//   audioInputSelect.onchange = start
//   videoSelect.onchange = start
//   start()
// })

// $('#preview-webcam').on('hide.bs.modal', function (e) {
//   console.log('stoping preview')
//   var preview = document.querySelector('#videoPreview')

//   if (preview.srcObject) {
//     var stream = preview.srcObject
//     var tracks = stream.getTracks()

//     for (var i = 0; i < tracks.length; i++) {
//       var track = tracks[i]
//       track.stop()
//     }

//     preview.srcObject = null
//   }
// })

// $('#webcam-share').click(function () {
//   console.log('starting share')
//   $('#preview-webcam').modal('hide')
// })

const WebcamPreview = () => (
  <WebcamPreview />
  // <div className='modal fade' id='preview-webcam' tabIndex='-1' aria-labelledby='preview-webcam-label' aria-hidden='true'>
  //   <div className='modal-dialog modal-xl'>
  //     <div className='modal-content'>
  //       <div className='modal-header'>
  //         <h5 className='modal-title' id='preview-webcam-label'>Preview</h5>
  //         <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
  //           <span aria-hidden='true'>&times;</span>
  //         </button>
  //       </div>
  //       <div className='modal-body'>
  //         <div id='container-preview'>
  //           <div className='d-flex justify-content-center'>
  //             <video playsInline autoPlay id='videoPreview' width='640' />
  //           </div>
  //           <div className='d-flex justify-content-center'>
  //             <label htmlFor='videoSource'>Video source:</label><select id='videoSource' />
  //             <label htmlFor='audioSource'>Audio source:</label><select id='audioSource' />
  //           </div>
  //           <div className='d-flex justify-content-center'>
  //             <canvas width='320px' height='30px' id='vumeter' />
  //           </div>
  //         </div>
  //       </div>
  //       <div className='modal-footer'>
  //         <button type='button' className='btn btn-secondary' data-dismiss='modal'>Close</button>
  //         <button type='button' className='btn btn-primary' id='webcam-share'>Start</button>
  //       </div>
  //     </div>
  //   </div>
  // </div>
)

export default WebcamPreview
