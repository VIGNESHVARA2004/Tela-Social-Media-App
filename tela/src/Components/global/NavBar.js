import React,{useState} from 'react'
import { HiUserCircle} from "react-icons/hi"
import {RiHomeHeartFill, RiQuillPenFill, RiNotification3Fill } from "react-icons/ri"
import {MdExplore} from "react-icons/md"
import './NavBar.css';


export default function NavBar() {
  const [value, setvalue] = useState(0);
  console.log(value);
  return (
    <div className='NavBar-outer'>
        <div><button type='button' onClick={() => setvalue(1)}><RiHomeHeartFill/></button></div>
        <div><button type='button' onClick={() => setvalue(2)}><MdExplore/></button></div>
        <div><button type='button' onClick={() => setvalue(3)}><RiQuillPenFill/></button></div>
        <div><button type='button' onClick={() => setvalue(4)}><RiNotification3Fill/></button></div>
        <div><button type='button' onClick={() => setvalue(5)}><HiUserCircle/></button></div>
    </div>
  )
}

export function getValue()
{
  console.log(NavBar.value);
  return NavBar.value;
}
