import React, { useState } from 'react';
import '../style/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Sendcode() {
  const [code,setCode]=useState('')
  const codeInput=(event)=>{
    setCode(event.target.value)
  }
  const navigation=useNavigate()

  const API_URL = import.meta.env.VITE_API_URL;
 
  const [error, setError] = useState('');


  const handleSubmit =async (e) => {
    e.preventDefault(); 



    setError('');
    try{
        const emailStored=localStorage.getItem('email')
        const email= emailStored ? JSON.parse(emailStored) : null;
        localStorage.setItem('code',code)
        const res=await axios.post(`${API_URL}api/auth/verify-code`,{email,code})

        if(res.status==200){
            alert('Code Verified ✅');
            navigation('/resetpwd')

        }

        

    }catch(err){
        setError(err.response?.data || ' Code verification failed !! ');
        console.log('  Code verification failed !!',err)

    }
    
  };

  return (
   
    <div className="auth-container" >
      
      <div className="auth-card">
        
        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        <h3 className="auth-title"> Verify code  </h3>

        <div className="form-content fade-in">
          <form onSubmit={handleSubmit}>

             <div className="input-group">
              <label>Enter the email verification code : </label>
              <input type="" placeholder="Enter code" className="auth-input" value={code} onChange={codeInput} />
            </div>
            
           

          

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="auth-btn">
              Verify  
            </button>
          </form>

          <div className="auth-footer">
            <span> Remembered your password ?   </span>
            <Link to='/login' className="link-btn">
              Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}