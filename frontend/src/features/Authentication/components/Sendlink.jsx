import { toast } from 'react-toastify';
import React, { useState } from 'react';
import '../style/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Sendlink() {
  const [email, setEmail] = useState('')
  const emailInput = (event) => {
    setEmail(event.target.value)
  }

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;


  const handleSubmit = async (e) => {
    e.preventDefault();



    try {
      const res = await axios.post(`${API_URL}api/auth/forgot-password`, { email })

      if (res.status == 200) {
        toast.success('Code sent! Please check your email.');
        navigate('/resetpwd', { state: { email } });
      }



    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Password reset failed';
      toast.error(msg);
      console.log('  password reset failed !!', err)

    }

  };

  return (

    <div className="auth-container" >

      <div className="auth-card">

        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        <h3 className="auth-title">Send Verification Code</h3>

        <div className="form-content fade-in">
          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email </label>
              <input type="email" placeholder="example@mail.com" className="auth-input" value={email} onChange={emailInput} />
            </div>




            <button type="submit" className="auth-btn">
              Send Code
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