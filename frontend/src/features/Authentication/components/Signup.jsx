import { useEffect, useState } from "react";
import '../style/auth.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {useAuth} from './Authprovider'
import axios from "axios";

import { useLocation } from 'react-router-dom';

export default function Signup() {

  const API_URL = import.meta.env.VITE_API_URL;
   const location = useLocation();

  const navigate=useNavigate()
  const {login}=useAuth()

  let [email,setEmail]=useState('')
  let [pwd,setPwd]=useState('')
  let [prenom,setPrenom]=useState('')
  let [nom,setNom]=useState('')
  let [tel,setTel]=useState('')
  let [file, setFile] = useState(null);


  let [error,setError]=useState(false)
  let [errmsg,setErrmsg]=useState('')

  const emailInput=(event)=>{
    setEmail(event.target.value)
  }
  const pwdInput=(event)=>{
    setPwd(event.target.value)
  }
  const prenomInput=(event)=>{
    setPrenom(event.target.value)
  }
   const nomInput=(event)=>{
    setNom(event.target.value)
  }
  const telInput=(event)=>{
    setTel(event.target.value)
  }
  const fileInput = (e) => {
  setFile(e.target.files[0]); 
  };
  
  let [isdriver,setIsdriver]=useState(false)


  useEffect(()=>{
    const fct=()=>{
      
      if(location.pathname=='/driversignup'){
        setIsdriver(true)
      }
    }
    fct()
  },[])



  const trysignup=async(e)=>{
     e.preventDefault();
    setError(false)
      try{
        if(!email.trim() || !pwd.trim() ||!prenom.trim() || !nom.trim() || !tel.trim()){
          setError(true)
          setErrmsg(' الرجاء ملء جميع الحقول !')
          return
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
        let role=isdriver?'driver':'client'
        formData.append("role", role);

        const res=await axios.post(`${API_URL}api/auth/register`, formData);

        if(res.status==201){
            console.log(`${role} was created`)

          const userdata=res.data
          
          login(userdata)
          isdriver?
          navigate('/driverprofile'):
          navigate('/clientprofile')
  
  
          return
        }
  
       
  
      }catch(err){
        setError(true)
        setErrmsg(err.response?.data.message|| ' !! Error logging in ')
        console.log('Error logging in !!',err)
      }
  
  
  
    }



  return (
    <div className="auth-container" dir="rtl">
      
      <div className="auth-card">

        <Link to='/' className="brand-logo">🚚 MoveMorocco</Link>
        { (!isdriver)?
          <h3 className="auth-title">إنشاء حساب جديد</h3>
        :
        <h3 className="auth-title"> سجل الآن كسائق وابدأ باستقبال الطلبات</h3>
}

        <div className="form-content fade-in">
          <form onSubmit={trysignup}>
            <div className="input-group">
              <label>الاسم</label>
              <input type="text" placeholder="الاسم " className="auth-input" value={prenom} onChange={prenomInput} />
            </div>
             <div className="input-group">
              <label>النسب</label>
              <input type="text" placeholder="النسب" className="auth-input" value={nom} onChange={nomInput} />
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
            <div className="input-group">
              <label> ادخل صورة ملفك الشخصي</label>
              <input type="file" className="auth-input"  accept="image/*" onChange={fileInput} />
            </div>

            <button className="auth-btn" >إنشاء حساب</button>
          </form>
          {error && (<div className='errmessage'>{errmsg}</div>)}

         { (isdriver)? ( <div className="auth-footer">
            <span>لديك حساب بالفعل؟ </span>
            <Link to='/login'  className="link-btn">
              تسجيل الدخول
            </Link>
             
           </div>)
           :
            (<div className="auth-footer">
            <span>هل تريد التسجيل كسائق ؟ </span>
            <button onClick={()=>setIsdriver(true)}  className="link-btn">
              انقر هنا
            </button>
             
            </div>)
          }
        </div>
        
      </div>
    </div>
  );
}