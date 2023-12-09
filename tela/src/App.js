import './App.css';
import { useEffect,useState } from 'react';
import Login from './Components/login/login';
import Footer from './Components/Footer/Footer';
import {Route,useLocation,BrowserRouter, Routes,Router} from 'react-router-dom';
import Register from './Components/register/Register';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import Home from './Components/HomePage/Home';
import UserProfile from './Components/UserProfile/UserProfile';
import PostView from './Components/PostView/PostView';
import UserProfileView from './Components/UserProfile View/UserProfileView';
import Notification from './Components/Notification/Notification';
import Message from './Components/Message/Message';
import './Components/firebase';
import MainContent from './Components/MainContent/MainContent';
const ScrolltoTop = () => {
  const {pathname} = useLocation();
  useEffect(() => {
    window.scrollTo(0,0);
  },[pathname])
  return null;
}
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="App">
      <BrowserRouter>
        <ScrolltoTop/>
        <Routes>
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
          <Route  element={<Home/>}>
            <Route path="/MainContent" element={<MainContent/>}/>
            <Route path="/user-profile" element={<UserProfile/>}/>
            <Route path="/Message" element={<Message/>}/>
            <Route path="/Notification" element={<Notification/>}/>
            <Route path="/user/:userId" element={<UserProfileView/>}/>
            <Route path="/post/:postId" element={<PostView/>} />
          </Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;