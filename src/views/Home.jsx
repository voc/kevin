import React from 'react'
import { Link } from 'react-router-dom'
import VideoContainer from 'views/widgets/VideoContainer'

export default class Home extends React.Component {
  render () {
    return (
      <div className='home'>
        <section className='features-icons bg-light text-center'>
          <div className='container'>
            <div className='row' id='header'>
              <Link to='/chatRoom' className='col-lg-4 btn'>
                <div className='mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3'>
                  <div className='d-flex features-icons-icon'>
                    <i className='material-icons m-auto text-primary' data-bs-hover-animate='pulse'>group_add</i>
                  </div>
                  <h3>Group Chat</h3>
                  <p className='lead mb-0'>Create a Group Chat with several people</p>
                </div>
              </Link>
              <Link to='/shareWebcam' className='col-lg-4 btn'>
                <div className='mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3'>
                  <div className='d-flex features-icons-icon'>
                    <i className='icon-camrecorder m-auto text-primary' data-toggle='modal' data-target='#preview-webcam' data-bs-hover-animate='pulse' />
                  </div>
                  <h3>Share Webcam</h3>
                  <p className='lead mb-0'>Share your Webcam + Audio</p>
                </div>
              </Link>
              <Link to='/shareScreen' className='col-lg-4 btn'>
                <div className='mx-auto features-icons-item mb-5 mb-lg-0 mb-lg-3'>
                  <div className='d-flex features-icons-icon'>
                    <i className='icon-screen-desktop m-auto text-primary' data-bs-hover-animate='pulse' />
                  </div>
                  <h3>Share Screen</h3>
                  <p className='lead mb-0'>Share your Screen</p>
                </div>
              </Link>
            </div>
            <div className='row'>
              <div className='col-auto align-self-center mx-auto'>
                <VideoContainer />
              </div>
            </div>
            <div className='row'>
              <div className='col-auto align-self-center mx-auto form-check'>
                <input className='form-check-input' type='checkbox' value='' id='recordInput' />
                <label className='form-check-label' htmlFor='recordInput'>
                  Enable Recording
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
