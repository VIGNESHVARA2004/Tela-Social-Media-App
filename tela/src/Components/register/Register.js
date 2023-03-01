import React,{useState} from 'react'
import Apple from "../imgs/download-on-the-app-store-apple-logo-svgrepo-com.svg";
import Google from "../imgs/Google_Play-Logo.wine.svg"
import Image from "../imgs/Logo.svg"
import './register.css'
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const[fullname,setfullname]=useState('');
  const[email,setemail]=useState('');
  const[username,setUsername]=useState('');
  const[password,setpassword]=useState('');
  const senddb=(e)=>{
    e.preventDefault()
    const details={email,fullname,password,username}
    if(email.length==0||password.length==0||fullname.length==0||username.length==0){
      alert("Enter All fields")
    }
    else{
    fetch("http://localhost:8080/post",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(details)
    }
    ).then(()=>{
      console.log("New Detail Added");   
      console.log(JSON.stringify(details));
      console.log(e);
      navigate("/")
    })
  }
}
  return (
    <div className='main-box'>
        <div className='register-inner-box'>
            <div className='logo-box'><img alt ='logo' src={Image}/></div>
            <div className='reg-login-box'>
              <div className='email-box input-box'>
                <input type='text' value={email} onChange={(e)=>setemail(e.target.value)} required></input>
                <label>Email</label>
              </div>
              <div className='Name-box input-box'>
                <input type='text' value={fullname} onChange={(e)=>setfullname(e.target.value)} required></input>
                <label>Full Name</label>
              </div>
              <div className='Username-box input-box'>
                <input type='text' value={username} onChange={(e)=>setUsername(e.target.value)} required></input>
                <label>Username</label>
              </div>
              <div className='Password-box input-box'>
                <input type='password' value={password} onChange={(e)=>setpassword(e.target.value)} required></input>
                <label>Password</label>
              </div>
              <div className='policy-box'>
                <p>By signing up, you agree to our <span>Terms</span>, <span>Privacy Policy</span> and <span>Cookies Policy</span>.</p>
              </div>
            </div>
            <div className='button-box'>
              <input type='button' value="Sign up" onClick={senddb}></input>
            </div>
            <div className='register-link-box'>
              <p className='register-p'>Have an account? <span onClick={() => navigate("/")}>Log in</span></p>
              
            </div>
            <div className='reg-app-link-box'>
              <div className='app-text'><p>Get the app</p></div>
              <div className='logos'>
                <img alt='' src={Apple}/>
                <img alt='' src={Google}/>
              </div>
            </div>
        </div>
    </div>
  )
}
