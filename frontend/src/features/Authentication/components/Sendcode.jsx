import React, { useState } from 'react';
import '../style/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Sendcode() {
  const [email,setEmail]=useState('')
  const emailInput=(event)=>{
    setEmail(event.target.value)
  }
  const navigation=useNavigate()

  const API_URL = import.meta.env.VITE_API_URL;
 
  const [error, setError] = useState('');


  const handleSubmit =async (e) => {
    e.preventDefault(); 



    setError('');
    try{
        const res=await axios.post(`${API_URL}api/auth/forgot-password`,{email})

        if(res.status==200){
            alert('Link sent successfully ✅');
            navigation('/resetpwd')

        }

        

    }catch(err){
        setError(err.response?.data || ' password reset failed !! ');
        console.log('  password reset failed !!',err)

    }
    
  };

  return (
   
    <div className="auth-container" >
      
      <div className="auth-card">
        
        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        <h3 className="auth-title">Change password  </h3>

        <div className="form-content fade-in">
          <form onSubmit={handleSubmit}>

             <div className="input-group">
              <label>Email </label>
              <input type="email" placeholder="example@mail.com" className="auth-input" value={email} onChange={emailInput} />
            </div>
            
           

          

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="auth-btn">
              Send link  
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