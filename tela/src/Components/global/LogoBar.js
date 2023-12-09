import React from 'react'
import Logo from '../imgs/Logo.svg'
import './LogoBar.css'

export default function LogoBar() {
  return (
    <div className='LogoBar-outer'>
        <div className='LogoBar-inner'>
            <img src={Logo} alt='Logo'/>
        </div>
    </div>
  )
}
