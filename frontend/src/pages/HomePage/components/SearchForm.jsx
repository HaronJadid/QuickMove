import React, { useEffect } from 'react';
import '../style/SearchForm.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function SearchForm() {
  let [err,setErr]=useState(false)
  const API_URL = import.meta.env.VITE_API_URL;
  let [villes,setVilles]=useState(null)

  let [ville_depart,setVille_depart]=useState('')
  let [ville_arrivee,setVille_arrivee]=useState('')


     useEffect(()=>{
      let fetchvilles=async()=>{
       const res= await axios.get(`${API_URL}api/ville/`)
        setVilles(res.data.villes)
        console.log(res.data)
        console.log(villes)
        
      }
      fetchvilles()

     },[])

  const navigate=useNavigate()

  const lookup=async(e)=>{
     e.preventDefault();
    setErr(false)

    if(ville_depart&&ville_arrivee){
      localStorage.setItem('ville_depart', ville_depart);
      localStorage.setItem('ville_arrivee', ville_arrivee);
      setVille_depart('')
      setVille_arrivee('')
      navigate('/searchresult')
    }
    else{
      setErr(true)


    }
      

  }


  return (
    <div className="search-card-container" dir="rtl">
      
      <div className="card-header">
        <div className="header-title">

          <span className="search-icon-red">🔍</span>
          <h2>ابدأ البحث الآن</h2>
        </div>
      </div>
    <form onSubmit={lookup}>
      <div className="form-grid">
        
        <div className="input-group">
          <label>مدينة المغادرة <span className="required">*</span></label>
          <select className="form-input" value={ville_depart} onChange={(event)=>setVille_depart(event.target.value)}>
            <option value="" disabled selected>اختر مدينة المغادرة </option>
           {( villes)&& villes.map((ville,index)=>(
              <option  key={index} value={ville.id}>{ville.nom}</option>
            ))}
            

          </select>
        </div>

        <div className="input-group">
          <label>مدينة الوصول <span className="required">*</span></label>
          <select className="form-input" value={ville_arrivee} onChange={(event)=>setVille_arrivee(event.target.value)}>
              <option value="" disabled selected>اختر مدينة المغادرة </option>

                {(villes) &&villes.map((ville,index)=>(
              <option  key={index} value={ville.id}>{ville.nom}</option>
            ))}

          </select>
        </div>

        {/* <div className="input-group">
          <label>تاريخ النقل</label>
          <input type="date" className="form-input" value={date_depart} onChange={(event)=>setDate_depart(event.target.value)} />
        </div>

        <div className="input-group">
          <label>نوع المركبة </label>
          <select className="form-input" value={type_transport} onChange={(event)=>setType_transport(event.target.value)}>
            <option value="" disabled selected>اختر نوع المركبة</option>
            <option value="truck">شاحنة</option>
            <option value="van">عربة نقل</option>
          </select>
        </div> */}

      </div>

      <button type='submit' className="submit-btn">
        ابحث عن السائقين المتاحين 
        <span className="btn-icon">🔍</span>
      </button>
      </form>
      {err &&<div style={{color:'rgba(215, 130, 144, 1)',textAlign:'center'
      }} >يجب تحديد كلتا المدينتين  !!</div>}

    </div>
  );
}