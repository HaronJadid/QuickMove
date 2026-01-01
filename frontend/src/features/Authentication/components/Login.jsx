import React, { useState } from 'react';
import '../style/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Authprovider';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  let [email, setEmail] = useState('');
  let [pwd, setPwd] = useState('');

  let [error, setError] = useState(false);
  let [errmsg, setErrmsg] = useState('');

  const emailInput = (event) => {
    setEmail(event.target.value);
  }
  const pwdInput = (event) => {
    setPwd(event.target.value);
  }

  const trylogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !pwd) {
        setError(true);
        setErrmsg(t('auth.fill_all_fields'));
        return;
      }
      setError(false);
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password: pwd });

      if (res.status == 200) {
        const userdata = res.data;
        login(userdata);
        if (userdata.role == 'client') {
          navigate('/clientprofile');
        } else {
          navigate('/driverprofile');
        }
        return;
      }

    } catch (err) {
      setError(true);
      setErrmsg(err.response?.data?.message || t('auth.login_error'));
      console.log(' !! Error logging in ', err);
    }
  }

  return (
    <div className="auth-container">
      {/* Absolute positioning for top controls */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '15px' }}>
        <LanguageSwitcher />
        <Link to="/" className="return-home-btn" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
          🏠 {t('auth.return_home')}
        </Link>
      </div>

      <div className="auth-card">
        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        <h3 className="auth-title">{t('auth.login_title')}</h3>

        <div className="form-content fade-in">
          <form onSubmit={trylogin}>
            <div className="input-group">
              <label>{t('auth.email')}</label>
              <input type="email" placeholder="example@mail.com" className="auth-input" value={email} onChange={emailInput} />
            </div>

            <div className="input-group">
              <label>{t('auth.password')}</label>
              <input type="password" placeholder="••••••••" className="auth-input" value={pwd} onChange={pwdInput}
              />
            </div>

            <div className="forgot-password">
              <Link to='/sendlink'>{t('auth.forgot_password')}</Link>
            </div>

            <button className="auth-btn">{t('auth.login_btn')}</button>
          </form>
          {error && (<div className='errmessage'>{errmsg}</div>)}

          <div className="auth-footer">
            <span>{t('auth.no_account')} </span>
            <Link to='/signup' className="link-btn">
              {t('auth.create_account')}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
