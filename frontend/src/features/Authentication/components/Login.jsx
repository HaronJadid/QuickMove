import React, { useState } from 'react';
import '../style/auth.css'; 
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from './Authprovider'
import axios from 'axios';

export default function Login() {

  const navigate=useNavigate()
  const {login}=useAuth()

  let [email,setEmail]=useState('')
  let [pwd,setPwd]=useState('')

  let [error,setError]=useState(false)
  let [errmsg,setErrmsg]=useState('')

  const emailInput=(event)=>{
    setEmail(event.target.value)
  }
  const pwdInput=(event)=>{
    setPwd(event.target.value)
  }


  const trylogin=async()=>{
    try{
  
      if(!email || !pwd){
        setError(true)
        setErrmsg('  يجب ملء كلا الحقلين !')
        return
      }
      setError(false)
      const res=await axios.post('http://localhost:3000/api/auth/login',{email,password:pwd})

      if(res.status==200){

        const userdata=res.data
        
        login(userdata)
        if(userdata.role=='client'){
           navigate('/clientprofile')
        }else{
           navigate('/driverprofile')
        }
       


        return
      }

     

    }catch(err){
      setError(true)
      setErrmsg(err.response?.data|| '!! Error logging in ')
      console.log(' !! Error logging in ',err)
    }



  }


  return (
    <div className="auth-container" dir="rtl">
      
      <div className="auth-card">
        
        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        <h3 className="auth-title">تسجيل الدخول</h3>

        <div className="form-content fade-in">
          <form onSubmit={(e) => { e.preventDefault();  }}>
            <div className="input-group">
              <label>البريد الإلكتروني</label>
              <input type="email" placeholder="example@mail.com" className="auth-input" value={email} onChange={emailInput} />
            </div>
            
            <div className="input-group">
              <label>كلمة المرور</label>
              <input type="password"  placeholder="••••••••" className="auth-input" value={pwd} onChange={pwdInput}  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
  title="كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص"
   />
            </div>

            <div className="forgot-password">
              <Link to='/sendlink'>نسيت كلمة المرور؟</Link>
            </div>

            <button className="auth-btn" onClick={trylogin}>تسجيل الدخول</button>
          </form>
          {error && (<div className='errmessage'>{errmsg}</div>)}

          <div className="auth-footer">
            <span>ليس لديك حساب؟ </span>
            <Link to='/signup' className="link-btn">
              انشئ حساب الآن
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}