import React, { useState } from 'react';
import Apple from "../imgs/download-on-the-app-store-apple-logo-svgrepo-com.svg";
import Google from "../imgs/Google_Play-Logo.wine.svg";
import Image from "../imgs/Logo.svg";
import './register.css';
import { useNavigate } from 'react-router-dom';
import { storage, auth } from '../firebase'; // Correct import statements for Firebase objects
import { createUserWithEmailAndPassword } from 'firebase/auth';
import videoBackground from './register-background.mp4';

export default function Signup() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const newSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        //userCredential.preventDefault();
        var user = userCredential.user;
        const userId = user.uid;
        const details = { email, fullname, password, userId, username };

        const requestOptions = {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(details),
        };

        fetch("http://localhost:8080/users",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(details)
          }
          )
          .then(() => {
            console.log("New Detail Added");
            console.log(JSON.stringify(details));
            localStorage.setItem("users",JSON.stringify(user));
            navigate("/");
          })
          .catch(error => {
            // Handle any fetch or other errors
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Handle the authentication error
      });
  };

  return (
    <div className='register-outer-div'>
      <video className='video-background' autoPlay muted no-repeat>
        <source src={videoBackground} type='video/mp4' />
      </video>
      <div className='register-main-box'>
        <div className='register-inner-box'>
          <div className='register-logo-box'><img alt='logo' src={Image} /></div>
          <div className='register-login-box'>
            <div className='register-email-box register-input-box'>
              <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} required></input>
              <label>Email</label>
            </div>
            <div className='register-Name-box register-input-box'>
              <input type='text' value={fullname} onChange={(e) => setFullname(e.target.value)} required></input>
              <label>Full Name</label>
            </div>
            <div className='register-Username-box register-input-box'>
              <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} required></input>
              <label>Username</label>
            </div>
            <div className='register-Password-box register-input-box'>
              <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required></input>
              <label>Password</label>
            </div>
            <div className='register-policy-box'>
              <p>By signing up, you agree to our <span>Terms</span>, <span>Privacy Policy</span>, and <span>Cookies Policy</span>.</p>
            </div>
          </div>
          <div className='register-button-box'>
            <input type='button' value="Sign up" onClick={newSignUp}></input>
          </div>
          <div className='register-link-box'>
            <p className='register-p'>Have an account? <span onClick={() => navigate("/")}>Log in</span></p>
          </div>
          <div className='register-app-link-box'>
            <div className='register-app-text'><p>Get the app</p></div>
            <div className='register-logos'>
              <img alt='' src={Apple} />
              <img alt='' src={Google} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
