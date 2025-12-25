import React from 'react';
import '../style/DriverComponent.css';


export default function DriverComponent() {
  return (
    <div className="driver-card" dir="rtl">
      
      {/* IMAGE SECTION */}
      <div className="card-image-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="Driver" 
          className="driver-image" 
        />
        
        {/* Top Badges */}
        <div className="badge-featured">
          <span className="crown-icon">👑</span> مميز
        </div>
        <div className="badge-verified">
          <span>معتمد</span> <span className="check-icon">🛡️</span>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="card-content">
        
        {/* Header: Name & Rating */}
        <div className="card-header-row">
          <h2 className="driver-name">أحمد بنعلي</h2>
          <div className="rating-box">
            <span className="star-icon">⭐</span>
            <span className="rating-score">3.9</span>
          </div>
        </div>

        {/* Location */}
        <div className="location-row">
          <span className="icon-grey">📍</span>
          <span className="location-text">الدار البيضاء - الرباط</span>
        </div>

        {/* Tags (Vehicle Types) */}
        <div className="tags-row">
          <span className="tag">كاميو</span>
          <span className="tag">هوندا</span>
        </div>

        <hr className="divider" />

        {/* Stats Row (Price & Trips) */}
        <div className="stats-row">
          <div className="price-section">
            <span className="label-small">يبدأ من</span>
            <div className="price-value">
              350 <span className="currency">درهم</span>
            </div>
          </div>
          <div className="trips-section">
            <span className="label-small">عدد الرحلات</span>
            <div className="trips-value">234</div>
          </div>
        </div>

        {/* Info List (Availability & Reviews) */}
        <div className="info-list">
          <div className="info-item">
            <span className="icon-clock">🕒</span>
            <span>متاح: متاح اليوم</span>
          </div>
          <div className="info-item">
            <span className="icon-chat">💬</span>
            <span>156 تقييم</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="view-profile-btn">
          عرض الملف الشخصي
          <span className="arrow-icon">←</span>
        </button>

      </div>
    </div>
  );
}