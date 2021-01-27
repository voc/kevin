import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => (
  <nav className='navbar navbar-light navbar-expand bg-light navigation-clean'>
    <div className='container'>
      <Link className='navbar-brand' to='/'>KEVIN</Link>
      {/* <button data-toggle='collapse' className='navbar-toggler' data-target='#navcol-1' />
      <div className='collapse navbar-collapse' id='navcol-1' /> */}
    </div>
  </nav>
)

export default Nav
