import React from 'react';
import '../style/SearchForm.css';
import { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function SearchForm() {

  let [depCity,setDepcity]=useState('')
  let [arrCity,setArrcity]=useState('')
  let [date,setDate]=useState()
  let [transType,setTranstype]=useState('')

  const navigate=useNavigate()

  const lookup=async()=>{
    try{
/*       const res=await axios.post('')
 */

      navigate('/searchresult')


    }catch(err){
      console.log('Error while searching :',err)
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

      <div className="form-grid">
        
        <div className="input-group">
          <label>مدينة المغادرة <span className="required">*</span></label>
          <select className="form-input" value={depCity} onChange={(event)=>setDepcity(event.target.value)}>
            <option value="" disabled selected>اختر مدينة المغادرة </option>
            <option value="casablanca">الدار البيضاء</option>
            <option value="rabat">الرباط</option>
          </select>
        </div>

        <div className="input-group">
          <label>مدينة الوصول <span className="required">*</span></label>
          <select className="form-input" value={arrCity} onChange={(event)=>setArrcity(event.target.value)}>
            <option value="" disabled selected>اختر مدينة الوصول </option>
            <option value="marrakech">مراكش</option>
            <option value="tangier">طنجة</option>
          </select>
        </div>

        <div className="input-group">
          <label>تاريخ النقل</label>
          <input type="date" className="form-input" value={date} onChange={(event)=>setDate(event.target.value)} />
        </div>

        <div className="input-group">
          <label>نوع المركبة <span className="required">*</span></label>
          <select className="form-input" value={transType} onChange={(event)=>setTranstype(event.target.value)}>
            <option value="" disabled selected>اختر نوع المركبة</option>
            <option value="truck">شاحنة</option>
            <option value="van">عربة نقل</option>
          </select>
        </div>

      </div>

      <button className="submit-btn" onClick={lookup}>
        ابحث عن السائقين المتاحين 
        <span className="btn-icon">🔍</span>
      </button>

    </div>
  );
}