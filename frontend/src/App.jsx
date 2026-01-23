import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage/HomePage'
import { Route, Routes } from 'react-router-dom'
import Aboutus from './layout/Header/headerComponents/Aboutus'
import Signup from './features/Authentication/components/Signup'
import Login from './features/Authentication/components/Login'
import Resetpwd from './features/Authentication/components/Resetpwd.jsx'
import VerifyCode from './features/Authentication/components/VerifyCode.jsx'
import Driverprofile from './pages/DriverProfile/Driverprofile.jsx'
import Clientprofile from './pages/ClientProfile/Clientprofile.jsx'
import Footer from './layout/Footer/Footer.jsx'
import { useLocation } from "react-router-dom";
import Header from './layout/Header/Header.jsx'
import SearchResult from './pages/SearchResult/SearchResult.jsx'
import DriverProfileClientSide  from './pages/SearchResult/components/DriverProfileClientSide.jsx'
import Bookings from './pages/DriverProfile/components/Bookings.jsx'
import Sendcode from './features/Authentication/components/Sendcode.jsx'
import Privateroute from './features/Authentication/components/Privateroute.jsx'


function App() {
  const { pathname } = useLocation()

  return (
    <>
        {pathname!== '/' && pathname!== '/signup' && pathname!== '/driversignup' && pathname!== '/login' && pathname!== '/resetpwd' && pathname!== '/sendlink' &&pathname!== '/verifyCode' && <Header />}
        
        <Routes>
          <Route path='/' element={<HomePage  />} />
          <Route path='/aboutus' element={<Aboutus/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/driversignup' element={<Signup/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/resetpwd' element={<Resetpwd />}  />
          <Route path='/sendlink' element={<Sendcode />}  />
          <Route path='/verifyCode' element={<VerifyCode /> } />
          <Route path='/searchresult' element={<SearchResult />} />
          <Route path='/lookupdriverprofile' element={<DriverProfileClientSide />} />

           <Route element={<Privateroute />}> 
            <Route path='/driverprofile' element={<Driverprofile />} />
            <Route path='/clientprofile' element={<Clientprofile />} />
            <Route path='/bookings' element={<Bookings/>} />


           </Route>
          <Route path='*' element={<div>Page not found !! </div>} />
        </Routes>

        <Footer/>
        
    </>
  )
}

export default App;
