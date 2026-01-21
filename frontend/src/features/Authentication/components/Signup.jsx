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


  let [error, setError] = useState(false)
  const [errmsg, setErrmsg] = useState('Error creating account !')
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
    setError(false)
    try {
      if (!email.trim() || !pwd.trim() || !prenom.trim() || !nom.trim() || !tel.trim()) {
        setError(true)
        setErrmsg(' You have to fill all fields !! ')
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
        isdriver ?
          navigate('/driverprofile') :
          navigate('/clientprofile')
        return
      }



    } catch (err) {
      setError(true)
      const specificMessage = err.response?.data?.message || err.response?.data?.error || 'Error creating account';
      setErrmsg(specificMessage)
      console.log('Error creating account !!', err)
      setIsLoading(false); // Stop loading on error
    }



  }



  return (
    <div className="auth-container" >

      <div className="auth-card">

        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        {(!isdriver) ?
          <h3 className="auth-title">  Create a new account</h3>
          :
          <h3 className="auth-title"> Sign up now as a driver and start receiving requests ! </h3>
        }

        <div className="form-content fade-in">
          <form onSubmit={trysignup}>
            <div className="input-group">
              <label>First name</label>
              <input type="text" placeholder="First name " className="auth-input" value={prenom} onChange={prenomInput} />
            </div>
            <div className="input-group">
              <label>Last name</label>
              <input type="text" placeholder="Last name" className="auth-input" value={nom} onChange={nomInput} />
            </div>

            <div className="input-group">
              <label> Email</label>
              <input type="email" placeholder="example@mail.com" className="auth-input" value={email} onChange={emailInput} />
            </div>

            <div className="input-group">
              <label>Phone number </label>
              <input type="tel" placeholder="06XXXXXXXX" className="auth-input" value={tel} onChange={telInput} />
            </div>

            <div className="input-group">
              <label>Password </label>
              <input type="password" placeholder="••••••••" className="auth-input" value={pwd} onChange={pwdInput} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                title="Password must contain at least 8 characters, 1 majuscule, 1 minuscule, a number and a special character"
              />
            </div>
            <div className="input-group">
              <label> Insert your profile picture </label>
              <input type="file" className="auth-input" accept="image/*" onChange={fileInput} />
            </div>

            <button className="auth-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create account'}
            </button>
          </form>
          {error && (<div className='errmessage'>{errmsg}</div>)}

          {(isdriver) ? (<div className="auth-footer">
            <span>Already have an account ?  </span>
            <Link to='/login' className="link-btn">
              Login
            </Link>

          </div>)
            :
            (<div className="auth-footer">
              <span>Do you want to sign up as a driver ? </span>
              <button onClick={() => setIsdriver(true)} className="link-btn">
                Click here
              </button>

            </div>)
          }
        </div>

      </div>
    </div>
  );
}