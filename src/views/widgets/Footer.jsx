import React from 'react'
import environment from 'js/environment'

const Footer = () => {
  return (
    <footer className='footer bg-light'>
      <div className='container'>
        <div className='row' id='footer'>
          <div className='col-lg-6 my-auto h-100 text-center text-lg-left'>
            <p className='text-muted small mb-4 mb-lg-0'>{environment.version}</p>
          </div>
          <div className='col-lg-6 my-auto h-100 text-center text-lg-right'>
            <a href='https://github.com/voc/kevin'><i className='fa fa-github fa-2x fa-fw' /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
