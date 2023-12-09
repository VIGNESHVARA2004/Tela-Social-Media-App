import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Image from '../imgs/Logo.svg';
import Apple from '../imgs/download-on-the-app-store-apple-logo-svgrepo-com.svg';
import Google from '../imgs/Google_Play-Logo.wine.svg';
import './login.css';
import axios from 'axios';
import { storage, auth } from '../firebase';
import videoBackground from './login-background.mp4';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setpassword] = useState('');
  const [user, setUser] = useState('');

  const fetchData = async () => {
      const response = await axios.get('http://localhost:8080/get/' + username);
      const data = response.data;
      setUser(data.password);
      console.log(user);
      localStorage.setItem('users', JSON.stringify(data));
  };

  useEffect(() => {
    if (user === '') {
      return;
    }

    if (user !== password) {
      alert('Incorrect Password');
    } else {
      navigate('/MainContent');
    }
  }, [user, password, navigate]);

  const loginChecker = async (event) => {
    event.preventDefault();
    await fetchData();
  };


  return (
    <div className='login-outer-div'>
      <video className='video-background' autoPlay muted no-repeat>
        <source src={videoBackground} type='video/mp4' />
      </video>
      <div className='main-box'>
        <div className='inner-box'>
          <div className='logo-box'>
            <img alt='logo' src={Image} />
          </div>
          <div className='login-box'>
            <div className='username-box'>
              <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} required></input>
              <label>Username</label>
            </div>
            <div className='password-box'>
              <input type='password' value={password} onChange={(e) => setpassword(e.target.value)} required></input>
              <label>Password</label>
            </div>
            <div className='forgot-pass-box'>
              <Link to='/ForgotPassword' className='forgot-pass-link'>Forgot Password?</Link>
            </div>
          </div>
          <div className='button-box'>
            <input type='button' value='Log in' onClick={loginChecker}></input>
          </div>
          <div className='register-link-box'>
            <p className='login-register-p'>Don't have an account? </p>
            <p className='Sign-up' onClick={() => navigate('/Register')}>Sign up</p>
          </div>
          <div className='app-link-box'>
            <div className='app-text'>
              <p>Get the app</p>
            </div>
            <div className='logos'>
              <img alt='' src={Apple} />
              <img alt='' src={Google} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
