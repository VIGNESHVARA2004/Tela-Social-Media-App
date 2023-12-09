import './App.css';
import { useEffect,useState } from 'react';
import Login from './Components/login/login';
import Footer from './Components/Footer/Footer';
import {Route,useLocation,BrowserRouter, Routes} from 'react-router-dom';
import Register from './Components/register/Register';
import Mainpage from './Components/Mainpage/mainpage';
import LogoBar from './Components/global/LogoBar';
import NavBar from './Components/global/NavBar';
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
        {isLoggedIn && <LogoBar/>}
        <Routes>
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="mainpage" element={<Mainpage/>}/>
        </Routes>
        {isLoggedIn && <NavBar/>}
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
