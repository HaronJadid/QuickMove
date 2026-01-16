import { useState } from "react";
import '../style/auth.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from './Authprovider';
import axios from "axios";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  let [email, setEmail] = useState('');
  let [pwd, setPwd] = useState('');
  let [prenom, setPrenom] = useState('');
  let [nom, setNom] = useState('');
  let [tel, setTel] = useState('');
  let [file, setFile] = useState(null);

  let [error, setError] = useState(false);
  let [errmsg, setErrmsg] = useState('');

  const emailInput = (event) => {
    setEmail(event.target.value);
  }
  const pwdInput = (event) => {
    setPwd(event.target.value);
  }
  const prenomInput = (event) => {
    setPrenom(event.target.value);
  }
  const nomInput = (event) => {
    setNom(event.target.value);
  }
  const telInput = (event) => {
    setTel(event.target.value);
  }
  const fileInput = (e) => {
    setFile(e.target.files[0]);
  };

  let [isdriver, setIsdriver] = useState(false);

  const trysignup = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      if (!email || !pwd || !prenom || !nom || !tel) {
        setError(true);
        setErrmsg(t('auth.fill_all_fields'));
        return;
      }

      const formData = new FormData();

      if (file) {
        formData.append("avatar", file);
      }

      formData.append("nom", nom);
      formData.append("prenom", prenom);
      formData.append("email", email);
      formData.append("password", pwd);
      formData.append("numero", tel);
      let role = isdriver ? 'driver' : 'client';
      formData.append("role", role);

      const res = await axios.post(`http://localhost:3000/api/auth/register`, formData);

      if (res.status == 201) {
        console.log(`${role} was created`);

        const userdata = res.data;

        login(userdata);
        isdriver ?
          navigate('/driverprofile') :
          navigate('/clientprofile');

        return;
      }

    } catch (err) {
      setError(true);
      setErrmsg(err.response?.data.message || t('auth.login_error'));
      console.log('Error logging in !!', err);
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
        {(!isdriver) ?
          <h3 className="auth-title">{t('auth.signup_title')}</h3>
          :
          <h3 className="auth-title">{t('auth.driver_signup_title')}</h3>
        }

        <div className="form-content fade-in">
          <form onSubmit={trysignup}>
            <div className="input-group">
              <label>{t('auth.firstname')}</label>
              <input type="text" placeholder={t('auth.firstname')} className="auth-input" value={prenom} onChange={prenomInput} />
            </div>
            <div className="input-group">
              <label>{t('auth.lastname')}</label>
              <input type="text" placeholder={t('auth.lastname')} className="auth-input" value={nom} onChange={nomInput} />
            </div>

            <div className="input-group">
              <label>{t('auth.email')}</label>
              <input type="email" placeholder="example@mail.com" className="auth-input" value={email} onChange={emailInput} />
            </div>

            <div className="input-group">
              <label>{t('auth.phone')}</label>
              <input type="tel" placeholder="06XXXXXXXX" className="auth-input" value={tel} onChange={telInput} />
            </div>

            <div className="input-group">
              <label>{t('auth.password')}</label>
              <input type="password" placeholder="••••••••" className="auth-input" value={pwd} onChange={pwdInput} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                title={t('auth.password_hint')}
              />
            </div>
            <div className="input-group">
              <label>{t('auth.profile_pic')}</label>
              <input type="file" className="auth-input" accept="image/*" onChange={fileInput} />
            </div>

            <button className="auth-btn" >{t('auth.signup_btn')}</button>
          </form>
          {error && (<div className='errmessage'>{errmsg}</div>)}

          {(isdriver) ? (<div className="auth-footer">
            <span>{t('auth.have_account')} </span>
            <Link to='/login' className="link-btn">
              {t('auth.switch_to_login')}
            </Link>

          </div>)
            :
            (<div className="auth-footer">
              <span>{t('auth.switch_to_driver')} </span>
              <button onClick={() => setIsdriver(true)} className="link-btn">
                {t('auth.click_here')}
              </button>

            </div>)
          }
        </div>

      </div>
    </div>
  );
}
