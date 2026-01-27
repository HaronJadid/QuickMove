import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import '../style/auth.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmpwd, setConfirmpwd] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  // Step 1: Verify Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      toast.error("Email and code are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}api/auth/verify-code`, { email, code });
      if (res.status === 200) {
        toast.success("Code verified! Please set your new password.");
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!pwd || !confirmpwd) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (pwd !== confirmpwd) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}api/auth/reset-password`, {
        email,
        code,
        newPassword: pwd
      });

      if (res.status === 200) {
        toast.success("Password updated successfully! Please login.");
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" dir="ltr">
      <div className="auth-card">

        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        <h3 className="auth-title">
          {step === 1 ? "Verify Code" : "Reset Password"}
        </h3>

        <div className="form-content fade-in">
          {step === 1 ? (
            <form onSubmit={handleVerifyCode}>
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="input-group">
                <label>Verification Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="auth-input"
                  placeholder="Enter 6-digit code"
                  required
                  style={{ letterSpacing: '2px', fontWeight: 'bold' }}
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="auth-input"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                  title="Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="auth-input"
                  value={confirmpwd}
                  onChange={(e) => setConfirmpwd(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

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