import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import MainContent from '../MainContent/MainContent';
import UserProfile from '../UserProfile/UserProfile';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <NavBar />
      <Outlet/>
    </div>
  );
}

export default Home;