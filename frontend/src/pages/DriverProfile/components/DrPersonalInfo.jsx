import React, { use } from 'react';
import { useState } from 'react';
import '../style/DrPersonalInfo.css';
import { useEffect } from 'react';


export default function DrPersonalInfo() {
  
    let [email,setEmail]=useState('')
    let [pwd,setPwd]=useState('')
    let [username,setUsername]=useState('')
    let [tel,setTel]=useState(null)

    let [edit,setEdit]=useState(false)

     const save =async()=>{
      setEdit(false)
     /*   const id=localStorage.getItem('userdata.id')
      const res=await axios.get('http://localhost:3000/api/user/:id')
     */
    }

    useEffect(async()=>{
      const id=localStorage.getItem('userdata.id')
      const res=await axios.get('http://localhost:3000/api/user/:id')

    }
      ,[])
    const user = {
      prenom: res.prenom,
      nom:res.nom,
      email: res.email,
      phone:res.tel,
      role: "حساب سائق", 
      avatar: res.imgUrl || '../../../../public/alt_img.webp'
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
            <label>الاسم </label>
           { (!edit)? ( <div className="read-only-input">{user.prenom}</div>):
            (<input type="text" placeholder="الاسم " className="read-only-input" value={prenom} onChange={(event)=>setPrenom(event.target.value)} />)}
          </div>
           <div className="input-group">
            <label> النسب</label>
           { (!edit)? ( <div className="read-only-input">{user.nom}</div>):
            (<input type="text" placeholder=" النسب" className="read-only-input" value={nom} onChange={(event)=>setNom(event.target.value)} />)}
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