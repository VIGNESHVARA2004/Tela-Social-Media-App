import React,{useState} from 'react'
import Image from "../imgs/Logo.svg"
import Apple from "../imgs/download-on-the-app-store-apple-logo-svgrepo-com.svg";
import Google from "../imgs/Google_Play-Logo.wine.svg"
import './login.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login() {
  const navigate = useNavigate();
  const[username,setUsername]=useState('');
  const[password,setpassword]=useState('');
  const[user,setUser]=useState('');
  const fetchData = () => {
    return axios.get("http://localhost:8080/get/"+username)
          .then((data) => setUser(data));
  }
  const loginChecker = () =>{
    console.log(user.data);
    fetchData();
    if(user === '')
    {
      alert("user not found");
    }
    else if(user.data !== password)
    {
      alert("Incorrect Password");
    }
    else{
      navigate("/mainpage");
    }
  }
  return (
    <div className='login-outer-div'>
      <div className='main-box'>
          <div className='inner-box'>
              <div className='logo-box'><img alt ='logo' src={Image}/></div>
              <div className='login-box'>
                <div className='username-box'>
                  <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}required></input>
                  <label>Username</label>
                </div>
                <div className='password-box'>
                  <input type='password' value={password} onChange={(e) => setpassword(e.target.value)} required></input>
                  <label>Password</label>
                </div>
                <div className='forgot-pass-box'>
                  <p>Forgot Password?</p>
                </div>
              </div>
              <div className='button-box'>
                  <input type='button' value="Log in" onClick={loginChecker}></input>
              </div>
              <div className='register-link-box'>
                <p className='register-p'>Don't have an account? </p>
                <p className='Sign-up' onClick={()=> navigate("/Register")}>Sign up</p>
              </div>
              <div className='app-link-box'>
                <div className='app-text'><p>Get the app</p></div>
                <div className='logos'>
                  <img alt='' src={Apple}/>
                  <img alt='' src={Google}/>
                </div>
              </div>
          </div>
      </div>
    </div>
  )
}
