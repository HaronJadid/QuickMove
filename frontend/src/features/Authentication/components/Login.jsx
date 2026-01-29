import { toast } from 'react-toastify';
import React, { useState } from 'react';
import '../style/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Authprovider'
import axios from 'axios';

export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL;


  const navigate = useNavigate()
  const { login } = useAuth()

  let [email, setEmail] = useState('')
  let [pwd, setPwd] = useState('')

  const emailInput = (event) => {
    setEmail(event.target.value)
  }
  const pwdInput = (event) => {
    setPwd(event.target.value)
  }


  const trylogin = async (e) => {
    e.preventDefault();
    try {

      if (!email.trim() || !pwd.trim()) {
        toast.error('Both fields must be filled!')
        return
      }

      const res = await axios.post(`${API_URL}api/auth/login`, { email, password: pwd })

      if (res.status == 200) {

        const userdata = res.data

        login(userdata)
        toast.success(`Welcome back ${userdata.prenom || ''}!`);
        if (userdata.role == 'client') {
          navigate('/clientprofile')
        } else {
          navigate('/driverprofile')
        }

        return
      }

    } catch (err) {
      // Extract specific error message from backend if available
      const specificMessage = err.response?.data?.message || err.response?.data?.error || 'Error logging in';
      toast.error(specificMessage);
      console.log(' !! Error logging in ', err);
    }

  }


  return (
    <div className="auth-container">
      <div className="auth-wrapper">

        {/* LEFT SIDE: VISUAL */}
        <div className="auth-visual-side">
          <div className="visual-content">
            <h1 className="visual-title">Welcome Back!</h1>
            <p className="visual-text">
              Log in to access your dashboard and manage your deliveries.
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

          {/* TABS REMOVED */}

          <h2 className="form-title">Login to Account</h2>
          <p className="form-subtitle">Enter your credentials to continue</p>

          <form onSubmit={trylogin}>
            <div className="input-container">
              <label>Email Address</label>
              <input type="email" placeholder="example@mail.com" className="modern-input" value={email} onChange={emailInput} />
            </div>

            <div className="input-container">
              <label>Password</label>
              <input type="password" placeholder="••••••••" className="modern-input" value={pwd} onChange={pwdInput} />
            </div>

            <div className="forgot-password">
              <Link to='/sendlink'>Forgot password?</Link>
            </div>

            <button className="primary-btn">Login</button>
          </form>

          <div className="form-footer-links">
            <div>
              Don't have an account?
              <Link to='/signup' className="form-link">Create one now</Link>
            </div>
            <Link to='/' className="back-home">
              &larr; Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
