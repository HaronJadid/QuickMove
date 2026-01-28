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
    <div className="auth-container">
      <div className="auth-wrapper">

        {/* LEFT SIDE: VISUAL */}
        <div className="auth-visual-side">
          <div className="visual-content">
            <h1 className="visual-title">Recovery</h1>
            <p className="visual-text">
              Don't worry, it happens. We'll help you get back into your account.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="auth-form-side">

          <div className="auth-header">
            <Link to='/' className="logo-big">
              <img src="/logo2.png" alt="Logo" className="logo-icon" />
              QuickMove
            </Link>
          </div>

          <h2 className="form-title">Forgot Password?</h2>
          <p className="form-subtitle">Enter your email to receive a recovery code</p>

          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="example@mail.com"
                className="modern-input"
                value={email}
                onChange={emailInput}
              />
            </div>

            <button type="submit" className="primary-btn">
              Send Code
            </button>
          </form>

          <div className="form-footer-links">
            <div>
              Remembered your password?
              <Link to='/login' className="form-link">Login here</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}