import React from 'react'
const RecordingControl = () => (
  <>
    <div className='row'>
      <div className='col-lg-4 align-self-center mx-auto'>
        <span id='recording-status' />
      </div>
      <div className='col-lg-4 align-self-center mx-auto'>
        <span id='recording-time' />
      </div>
      <div className='col-lg-4 align-self-center mx-auto'>
        <button className='btn btn-primary' id='btn-stop-recording' type='button'>Stop Recording</button>
      </div>
    </div>
  </>
)
export default RecordingControl
