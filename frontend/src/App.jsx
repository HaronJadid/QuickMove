import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage/HomePage'
import {Route,Routes} from 'react-router-dom'
import Aboutus from './layout/Header/headerComponents/Aboutus'
import Signup from './features/Authentication/components/Signup'
import Login from './features/Authentication/components/Login'
import Driversignup from './features/Authentication/components/Driversignup'
import Privateroute from './features/Authentication/components/Privateroute'
import Resetpwd from './features/Authentication/components/Resetpwd.jsx'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/aboutus' element={<Aboutus/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/driversignup' element={<Driversignup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/resetpwd' element={<Resetpwd />}  />


        <Route element={<Privateroute />}>
        

        </Route>
        <Route path='*' element={<div>Page not found !! </div>} />
      </Routes>
   
    
    </>
  )
}

export default App
