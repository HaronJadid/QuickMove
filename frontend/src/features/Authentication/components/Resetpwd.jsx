import React, { useState } from 'react';
import '../style/auth.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from "react-router-dom";



export default function ResetPassword() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [pwd, setPwd] = useState('');
  const [confirmpwd, setConfirmpwd] = useState('');
  const pwdInput=(event)=>{
    setPwd(event.target.value)
  }
  const confirmpwdInput=(event)=>{
    setConfirmpwd(event.target.value)
  }
  const [error, setError] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleSubmit =async (e) => {
    e.preventDefault(); 
     if (!token) {
      setMessage("Token missing !");
      return;
    }

    if (!pwd || !confirmpwd) {
      setError('المرجو ملء جميع الخانات');
      return;
    }

    if (pwd !== confirmpwd) {
      setError('كلمات المرور غير متطابقة ❌');
      return;
    }

    setError('');
    try{
        const res=await axios.post(`${API_URL}api/auth/reset-password`,{token,newPassword:pwd})

        if(res.status==200){
            alert('تم تغيير كلمة المرور بنجاح! ✅');

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
              <label>كلمة المرور الجديدة</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="auth-input"
                value={pwd}
                onChange={pwdInput}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                title="كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص"
                
              />
            </div>

            <div className="input-group">
              <label>تأكيد كلمة المرور</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="auth-input"
                value={confirmpwd}
                onChange={confirmpwdInput}
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                title="كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص"
            
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="auth-btn">
              تحديث كلمة المرور
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