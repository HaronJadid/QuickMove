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
    <div className="auth-container">
      <div className="auth-wrapper">

        {/* LEFT SIDE: VISUAL */}
        <div className="auth-visual-side">
          <div className="visual-content">
            <h1 className="visual-title">Reset Password</h1>
            <p className="visual-text">
              Secure your account with a new, strong password.
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

          <h2 className="form-title">
            {step === 1 ? "Verify Code" : "New Password"}
          </h2>
          <p className="form-subtitle">
            {step === 1
              ? "We sent a code to your email"
              : "Create a new password for your account"}
          </p>

          <div className="form-content">
            {step === 1 ? (
              <form onSubmit={handleVerifyCode}>
                <div className="input-container">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="modern-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="input-container">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="modern-input"
                    placeholder="Enter 6-digit code"
                    required
                    style={{ letterSpacing: '2px', fontWeight: 'bold' }}
                  />
                </div>

                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="input-container">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="modern-input"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                    title="Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
                    required
                  />
                </div>

                <div className="input-container">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="modern-input"
                    value={confirmpwd}
                    onChange={(e) => setConfirmpwd(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}

            <div className="form-footer-links">
              <div>
                Remembered your password?
                <Link to='/login' className="form-link">Login here</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}