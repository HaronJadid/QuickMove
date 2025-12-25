import React, { useState } from 'react';
import '../style/auth.css';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function Sendlink() {
  const [email,setEmail]=useState('')
  const emailInput=(event)=>{
    setEmail(event.target.value)
  }

 
  const [error, setError] = useState('');


  const handleSubmit =async (e) => {
    e.preventDefault(); 



    setError('');
    try{
        const res=await axios.post('http://localhost:3000/api/auth/forgot-password',{email})

        if(res.status==200){
            alert('تم ارسال الرابط بنجاح! ✅');

        }

        

    }catch(err){
        setError(err.response?.data || ' !! password reset failed ');
        console.log(' !! password reset failed ',err)

    }
    
  };

  return (
   
    <div className="auth-container" dir="rtl">
      
      <div className="auth-card">
        
        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        <h3 className="auth-title">تغيير كلمة المرور</h3>

        <div className="form-content fade-in">
          <form onSubmit={handleSubmit}>

             <div className="input-group">
              <label>البريد الإلكتروني</label>
              <input type="email" placeholder="example@mail.com" className="auth-input" value={email} onChange={emailInput} />
            </div>
            
           

          

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="auth-btn">
              ارسال الرابط 
            </button>
          </form>

          <div className="auth-footer">
            <span>تذكرت كلمة المرور؟ </span>
            <Link to='/login' className="link-btn">
              تسجيل الدخول
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}