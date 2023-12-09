import React, { useState } from 'react';
import Image from "../imgs/Logo.svg";
import Apple from "../imgs/download-on-the-app-store-apple-logo-svgrepo-com.svg";
import Google from "../imgs/Google_Play-Logo.wine.svg";
import './ForgotPassword.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { storage, auth } from '../firebase';
import videoBackground from './forgot-background.mp4';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');

  const updateData = () => {
    const data = {
      username: username,
      password: password
    };

    return axios.put("http://localhost:8080/putUsername/" + username, data)
      .then((response) => {
        const updatedUser = response.data;
        setUser(updatedUser.password);
        console.log(user);
        localStorage.setItem("users", JSON.stringify(updatedUser));
      });
  };

  const loginChecker = () => {
    updateData();
    navigate("/");
  };

  return (
    <div className='forgot-login-outer-div'>
      <video className='video-background' autoPlay muted no-repeat>
        <source src={videoBackground} type='video/mp4' />
      </video>
      <div className='forgot-main-box'>
        <div className='forgot-inner-box'>
          <div className='forgot-logo-box'><img alt='logo' src={Image} /></div>
          <div className='forgot-login-box'>
            <div className='forgot-username-box'>
              <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} required></input>
              <label>Username</label>
            </div>
            <div className='forgot-password-box'>
              <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required></input>
              <label>New Password</label>
            </div>
          </div>
          <div className='forgot-button-box'>
            <input type='button' value="Reset Password" onClick={loginChecker}></input>
          </div>
          <div className='forgot-app-link-box'>
            <div className='forgot-app-text'><p>Get the app</p></div>
            <div className='forgot-logos'>
              <img alt='' src={Apple} />
              <img alt='' src={Google} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
