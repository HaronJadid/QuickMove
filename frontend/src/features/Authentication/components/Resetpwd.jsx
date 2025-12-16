import React, { useState } from 'react';
import '../style/auth.css';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [email,setEmail]=useState('')
  const emailInput=(event)=>{
    setEmail(event.target.value)
  }

  const [pwd, setPwd] = useState('');
  const [confirmpwd, setConfirmpwd] = useState('');
  const pwdInput=(event)=>{
    setPwd(event.target.value)
  }
  const confirmpwdInput=(event)=>{
    setConfirmpwd(event.target.value)
  }
  const [error, setError] = useState('');


  const handleSubmit =async (e) => {
    e.preventDefault(); 

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
        const res=await axios.post('http://localhost:3000/auth',{email,pwd})

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
        
        <h2 className="brand-logo">🚚 MoveMorocco</h2>
        <h3 className="auth-title">تغيير كلمة المرور</h3>

        <div className="form-content fade-in">
          <form onSubmit={handleSubmit}>

             <div className="input-group">
              <label>البريد الإلكتروني</label>
              <input type="email" placeholder="example@mail.com" className="auth-input" value={email} onChange={emailInput} />
            </div>
            
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