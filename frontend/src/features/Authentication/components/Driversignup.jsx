import { useState } from "react";
import '../style/auth.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuth from './Authprovider'
import axios from "axios";



export default function Driversignup() {
     
  const navigate=useNavigate()

  let [email,setEmail]=useState('')
  let [pwd,setPwd]=useState('')
  let [prenom,setPrenom]=useState('')
  let [nom,setNom]=useState('')
  let [tel,setTel]=useState(null)
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


  const trysignup=async()=>{
    setError(false)
      try{
        if(!email || !pwd ||!username || !tel){
          setError(true)
          setErrmsg(' الرجاء ملء جميع الحقول !')
          return
        }
        

        const formData = new FormData();
        formData.append("imgUrl", file);
        formData.append("nom", nom);
        formData.append("prenom", prenom);
        formData.append("email", email);
        formData.append("password", pwd);
        formData.append("numero", tel);
        formData.append("role", 'driver');

        const res=await axios.post("/api/auth/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

  
        if(res.status==201){
          const userdata=res.data
          const {login}=useAuth()
          login(userdata)
          navigate('/driverprofile')
  
  
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
        <h3 className="auth-title"> سجل الآن كسائق وابدأ باستقبال الطلبات</h3>

        <div className="form-content fade-in">
          <form onSubmit={(e) => { e.preventDefault();  }}>
           
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
              <input type="password" placeholder="••••••••" value={pwd} onChange={pwdInput} className="auth-input"  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                title="كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص"
                />
            </div>

            <button className="auth-btn">إنشاء حساب</button>
          </form>
          {error && (<div className='errmessage'>{errmsg}</div>)}

          <div className="auth-footer">
            <span>لديك حساب بالفعل؟ </span>
            <Link to='/login'  className="link-btn">
              تسجيل الدخول
            </Link>
             
          </div>
        </div>
        
      </div>
    </div>
  );
}