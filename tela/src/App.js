import './App.css';
import { useEffect } from 'react';
import Login from './Components/login/login';
import Footer from './Components/Footer/Footer';
import {Route,useLocation,BrowserRouter, Routes} from 'react-router-dom';
import Register from './Components/register/Register';
import Mainpage from './Components/Mainpage/mainpage';
const ScrolltoTop = () => {
  const {pathname} = useLocation();
  useEffect(() => {
    window.scrollTo(0,0);
  },[pathname])
  return null;
}
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrolltoTop/>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="mainpage" element={<Mainpage/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
