import React, { use } from 'react';
import { useState } from 'react';
import '../style/CltPersonalInfo.css';
import { useEffect } from 'react';
import axios from 'axios';

export default function DrPersonalInfo() {
  
    let [email,setEmail]=useState('')
    let [prenom,setPrenom]=useState('')
    let [nom,setNom]=useState('')
    let [tel,setTel]=useState('')

    let [edit,setEdit]=useState(false)

    let [user,setUser]=useState(null)

    const userRetrieved=localStorage.getItem('user')
    const parsedUser=JSON.parse(userRetrieved)
    const id=parsedUser.userId
    console.log(id)

    const save =async()=>{
      setEdit(false)
     /*  
      const res=await axios.get('http://localhost:3000/api/user/:id')
     */
    }

    useEffect(()=>{
      const getinfo=async()=>{
        try{
          let res=await axios.get(`http://localhost:3000/api/user/${id}`)
          res=res.data.userInfo
          const fetchedData = {
            prenom: res.prenom,
            nom:res.nom,
            email: res.email,
            phone:res.numero,
            role: "حساب عميل", 
            avatar: res.imgUrl || '../../../../public/alt_img.webp'
          };
          
          setUser(fetchedData)

          setPrenom(fetchedData.prenom);
          setNom(fetchedData.nom);
          setEmail(fetchedData.email);
          setTel(fetchedData.phone);

      }catch(err){
        console.log('err',err)
      }
     

        }
         getinfo()
      
     
     
    }
      ,[id])

      if (!user) {
      return <div style={{textAlign: 'center', marginTop: '50px'}}>... جاري التحميل</div>;
    }
 

  return (
    <div className="profile-page-wrapper" dir="rtl">
      
      <div className="profile-card">
        
        <div className="profile-header">
          <img src={user.avatar || '../../../../public/alt_img.webp'} alt="Profile" className="profile-avatar" />
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