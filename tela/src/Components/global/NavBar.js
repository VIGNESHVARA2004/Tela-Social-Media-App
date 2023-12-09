import React from 'react'
import { HiUserCircle} from "react-icons/hi"
import {RiHomeHeartFill, RiQuillPenFill, RiNotification3Fill } from "react-icons/ri"
import {MdExplore} from "react-icons/md"
import './NavBar.css';
export default function() {
  return (
    <div className='NavBar-outer'>
        <div><RiHomeHeartFill/></div>
        <div><MdExplore/></div>
        <div><RiQuillPenFill/></div>
        <div><RiNotification3Fill/></div>
        <div><HiUserCircle/></div>
    </div>
  )
}
