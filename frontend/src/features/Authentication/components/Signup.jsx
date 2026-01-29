import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import '../style/auth.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from './Authprovider'
import axios from "axios";

import { useLocation } from 'react-router-dom';

export default function Signup() {

  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();

  const navigate = useNavigate()
  const { login } = useAuth()

  let [email, setEmail] = useState('')
  let [pwd, setPwd] = useState('')
  let [prenom, setPrenom] = useState('')
  let [nom, setNom] = useState('')
  let [tel, setTel] = useState('')
  let [file, setFile] = useState(null);


  const [isLoading, setIsLoading] = useState(false); // New state

  const emailInput = (event) => {
    setEmail(event.target.value)
  }
  const pwdInput = (event) => {
    setPwd(event.target.value)
  }
  const prenomInput = (event) => {
    setPrenom(event.target.value)
  }
  const nomInput = (event) => {
    setNom(event.target.value)
  }
  const telInput = (event) => {
    setTel(event.target.value)
  }
  const fileInput = (e) => {
    setFile(e.target.files[0]);
  };

  let [isdriver, setIsdriver] = useState(false)


  useEffect(() => {
    const fct = () => {

      if (location.pathname == '/driversignup') {
        setIsdriver(true)
      }
    }
    fct()
  }, [])



  const trysignup = async (e) => {
    e.preventDefault();
    try {
      if (!email.trim() || !pwd.trim() || !prenom.trim() || !nom.trim() || !tel.trim()) {
        toast.error('You have to fill all fields !!')
        return
      }



      setIsLoading(true);

      const formData = new FormData();
      if (file) {
        formData.append("avatar", file);
      }

      formData.append("nom", nom);
      formData.append("prenom", prenom);
      formData.append("email", email);
      formData.append("password", pwd);
      formData.append("numero", tel);

      let role = isdriver ? 'driver' : 'client'
      formData.append("role", role);

      const res = await axios.post(`${API_URL}api/auth/register`, formData);

      if (res.status == 201) {
        console.log(`${role} was created`)

        const userdata = res.data

        login(userdata)
        toast.success('Account created successfully!');
        isdriver ?
          navigate('/driverprofile') :
          navigate('/clientprofile')
        return
      }



    } catch (err) {
      const specificMessage = err.response?.data?.message || err.response?.data?.error || 'Error creating account';
      toast.error(specificMessage)
      console.log('Error creating account !!', err)
      setIsLoading(false); // Stop loading on error
    }



  }



  return (
    <div className="auth-container">
      <div className="auth-wrapper reverse">

        {/* LEFT SIDE: VISUAL (Now Right side due to reverse) */}
        <div className="auth-visual-side">
          <div className="visual-content">
            <h1 className="visual-title">Join QuickMove</h1>
            <p className="visual-text">
              {isdriver
                ? "Start earning by delivering packages with your vehicle."
                : "The fastest way to move your items anywhere, anytime."}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM (Now Left side due to reverse) */}
        <div className="auth-form-side">

          <div className="auth-header">
            <Link to='/' className="logo-big">
              <img src="/logo2.png" alt="Logo" className="logo-icon" />
              QuickMove
            </Link>
          </div>

          {/* TABS REMOVED */}

          <h2 className="form-title">Create Account</h2>
          <p className="form-subtitle">
            {isdriver ? "Partner with us today" : "Get started for free"}
          </p>

          <div className="role-toggle-container">
            <button
              className={`role-btn ${!isdriver ? 'active' : ''}`}
              onClick={() => { setIsdriver(false); navigate('/signup'); }}
            >
              Client
            </button>
            <button
              className={`role-btn ${isdriver ? 'active' : ''}`}
              onClick={() => { setIsdriver(true); navigate('/driversignup'); }}
            >
              Driver
            </button>
          </div>

          <form onSubmit={trysignup}>
            <div className="input-container">
              <label>First Name</label>
              <input type="text" placeholder="John" className="modern-input" value={prenom} onChange={prenomInput} />
            </div>

            <div className="input-container">
              <label>Last Name</label>
              <input type="text" placeholder="Doe" className="modern-input" value={nom} onChange={nomInput} />
            </div>

            <div className="input-container">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" className="modern-input" value={email} onChange={emailInput} />
            </div>

            <div className="input-container">
              <label>Phone Number</label>
              <input type="tel" placeholder="06XXXXXXXX" className="modern-input" value={tel} onChange={telInput} />
            </div>

            <div className="input-container">
              <label>Password</label>
              <input type="password" placeholder="••••••••" className="modern-input" value={pwd} onChange={pwdInput} />
            </div>

            <div className="input-container">
              <label>Profile Picture</label>
              <input type="file" className="modern-input" accept="image/*" onChange={fileInput} style={{ padding: '8px' }} />
            </div>

            <button className="primary-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="form-footer-links">
            <div>
              Already have an account?
              <Link to='/login' className="form-link">Login here</Link>
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