import React, { use } from 'react';
import { useState } from 'react';
import '../style/CltPersonalInfo.css';

export default function DrPersonalInfo() {
  
    let [email,setEmail]=useState('')
    let [pwd,setPwd]=useState('')
    let [username,setUsername]=useState('')
    let [tel,setTel]=useState(null)

    let [edit,setEdit]=useState(false)

    const save =()=>{
      setEdit(false)
    }


  const user = {
    fullName: "clientname",
    email: "Test@gmail.com",
    phone: "+212 601-232323",
    role: "حساب عميل", 
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&q=80"
  };

  return (
    <div className="profile-page-wrapper" dir="rtl">
      
      <div className="profile-card">
        
        <div className="profile-header">
          <img src={user.avatar} alt="Profile" className="profile-avatar" />
          <div className="role-badge">{user.role}</div>
        </div>

        <div className="profile-form">
          
          <div className="input-group">
            <label>الاسم الكامل</label>
           { (!edit)? ( <div className="read-only-input">{user.fullName}</div>):
            (<input type="text" placeholder="الاسم والنسب" className="read-only-input" value={username} onChange={(event)=>setUsername(event.target.value)} />)}
          </div>

          <div className="input-group">
            <label>البريد الإلكتروني</label>
           {(!edit) ? ( <div className="read-only-input">{user.email}</div>):
            (<input type='email' placeholder="example@mail.com" className="read-only-input" value={email} onChange={(event)=>setEmail(event.target.value)} />)}
          </div>

          <div className="input-group">
            <label>رقم الهاتف</label>
          {(!edit)? ( <div className="read-only-input" dir="ltr">{user.phone}</div>):
            (<input type="tel" placeholder="06XXXXXXXX" className="read-only-input" value={tel} onChange={(event)=>setTel(event.target.value)} />)}

          </div>

        </div>

        <div className="profile-footer">
         {(!edit ) ? ( <button className="edit-btn" onClick={()=>setEdit(true)}>تعديل الملف الشخصي</button>):
          (<button className="edit-btn" onClick={save}>حفظ</button>)}
        </div>

      </div>
    </div>
  );
}