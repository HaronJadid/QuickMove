import { useState } from "react";
import '../style/auth.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";




export default function Signup() {

  
  const navigate=useNavigate()

  let [email,setEmail]=useState('')
  let [pwd,setPwd]=useState('')
  let [username,setUsername]=useState('')
  let [tel,setTel]=useState(null)


  let [error,setError]=useState(false)
  let [errmsg,setErrmsg]=useState('')

  const emailInput=(event)=>{
    setEmail(event.target.value)
  }
  const pwdInput=(event)=>{
    setPwd(event.target.value)
  }
  const usernameInput=(event)=>{
    setUsername(event.target.value)
  }
  const telInput=(event)=>{
    setTel(event.target.value)
  }


  const trysignup=async()=>{
      try{
        if(!email || !pwd ||!username || !tel){
          setError(true)
          setErrmsg(' الرجاء ملء جميع الحقول !')
          return
        }
        setError(false)
        const res=await axios.post('http://localhost:3000/auth',{username,tel,email,pwd})
  
        if(res.status==200){
          const userdata=res.data
          const {login}=useAuth()
          login(userdata)
          navigate('/')
  
  
          return
        }
  
       
  
      }catch(err){
        setError(true)
        setErrmsg(err.response?.data|| ' !! Error logging in ')
        console.log('Error logging in !!',err)
      }
  
  
  
    }



  return (
    <div className="auth-container" dir="rtl">
      
      <div className="auth-card">

        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        <h3 className="auth-title">إنشاء حساب جديد</h3>

        <div className="form-content fade-in">
          <form onSubmit={(e) => { e.preventDefault();  }}>
            <div className="input-group">
              <label>الاسم الكامل</label>
              <input type="text" placeholder="الاسم والنسب" className="auth-input" value={username} onChange={usernameInput} />
            </div>

            <div className="input-group">
              <label>البريد الإلكتروني</label>
              <input type="email" placeholder="example@mail.com" className="auth-input" value={email} onChange={emailInput} />
            </div>

            <div className="input-group">
              <label>رقم الهاتف</label>
              <input type="tel" placeholder="06XXXXXXXX" className="auth-input" value={tel} onChange={telInput} />
            </div>

            <div className="input-group">
              <label>كلمة المرور</label>
              <input type="password"  placeholder="••••••••" className="auth-input" value={pwd} onChange={pwdInput} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                title="كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص"
                />
            </div>

            <button className="auth-btn" onClick={trysignup}>إنشاء حساب</button>
          </form>
          {error && (<div className='errmessage'>{errmsg}</div>)}

          <div className="auth-footer">
            <span>هل تريد التسجيل كسائق ؟ </span>
            <Link to='/driversignup'  className="link-btn">
              انقر هنا
            </Link>
             
          </div>
        </div>
        
      </div>
    </div>
  );
}