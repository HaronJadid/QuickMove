import React from 'react';
import '../../../assets/SearchForm.css';

export default function SearchForm() {
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
          <select className="form-input">
            <option value="" disabled selected>اختر مدينة المغادرة </option>
            <option value="casablanca">الدار البيضاء</option>
            <option value="rabat">الرباط</option>
          </select>
        </div>

        <div className="input-group">
          <label>مدينة الوصول <span className="required">*</span></label>
          <select className="form-input">
            <option value="" disabled selected>اختر مدينة الوصول </option>
            <option value="marrakech">مراكش</option>
            <option value="tangier">طنجة</option>
          </select>
        </div>

        <div className="input-group">
          <label>تاريخ النقل</label>
          <input type="date" className="form-input" />
        </div>

        <div className="input-group">
          <label>نوع المركبة <span className="required">*</span></label>
          <select className="form-input">
            <option value="" disabled selected>اختر نوع المركبة</option>
            <option value="truck">شاحنة</option>
            <option value="van">عربة نقل</option>
          </select>
        </div>

      </div>

      <button className="submit-btn">
        ابحث عن السائقين المتاحين 
        <span className="btn-icon">🔍</span>
      </button>

    </div>
  );
}