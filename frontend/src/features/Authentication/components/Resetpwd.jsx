import React, { useState } from 'react';
import '../style/auth.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const API_URL = import.meta.env.VITE_API_URL;

  const navigation=useNavigate()
  const [pwd, setPwd] = useState('');
  const [confirmpwd, setConfirmpwd] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const pwdInput = (event) => {
    setPwd(event.target.value);
  };
  const confirmpwdInput = (event) => {
    setConfirmpwd(event.target.value);
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
     if (!token) {
      setMessage("Token missing !");
      return;
    }

    if (!pwd || !confirmpwd) {
      setError('Please fill in all fields');
      return;
    }

    if (pwd !== confirmpwd) {
      setError('Passwords do not match ❌');
      return;
    }

    setError('');
    try {
        const emailStored=localStorage.getItem('email')
        const email= emailStored ? JSON.parse(emailStored) : null;
        const codeStored=localStorage.getItem('code')
        const code=codeStored ? JSON.parse(codeStored) : null;
        const res = await axios.post(`${API_URL}api/auth/reset-password`, { email,code, newPassword: pwd });

        if (res.status == 200) {
            alert('Password changed successfully! ✅');
            navigation('/login')
        }

    } catch (err) {
        setError(err.response?.data || '  password reset failed !!');
        console.log('  password reset failed !!', err);
    }
  };

  return (
    <div className="auth-container" dir="ltr">
      <div className="auth-card">
        
        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        <h3 className="auth-title">Reset Password</h3>

        <div className="form-content fade-in">
          <form onSubmit={handleSubmit}>
            
            <div className="input-group">
              <label>New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="auth-input"
                value={pwd}
                onChange={pwdInput}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                title="Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="auth-input"
                value={confirmpwd}
                onChange={confirmpwdInput}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                title="Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
              />
            </div>

            {error && <p className="error-msg">{error}</p>}
            {message && <p className="error-msg">{message}</p>}

            <button type="submit" className="auth-btn">
              Update Password
            </button>
          </form>

          <div className="auth-footer">
            <span>Remembered your password? </span>
            <Link to='/login' className="link-btn">
              Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}