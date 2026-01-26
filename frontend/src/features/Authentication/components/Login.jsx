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
    <div className="auth-container" dir="ltr">

      <div className="auth-card">

        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        <h3 className="auth-title">Login</h3>

        <div className="form-content fade-in">
          <form onSubmit={trylogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" placeholder="example@mail.com" className="auth-input" value={email} onChange={emailInput} />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" className="auth-input" value={pwd} onChange={pwdInput} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                title="Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
              />
            </div>

            <div className="forgot-password">
              <Link to='/sendlink'>Forgot your password?</Link>
            </div>

            <button className="auth-btn" >Login</button>
          </form>

          <div className="auth-footer">
            <span>Don't have an account? </span>
            <Link to='/signup' className="link-btn">
              Create account now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
