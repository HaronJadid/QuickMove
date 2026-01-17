import React from 'react';
import '../style/DriverComponent.css';
import { useTranslation } from 'react-i18next';


export default function DriverComponent() {
  const { t } = useTranslation();

  return (
    <div className="driver-card" >
        {/* IMAGE SECTION */}
    <div className="card-image-wrapper">
      <img 
        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        alt="Driver" 
        className="driver-image" 
      />
      
      {/* Top Badges */}
      <div className="badge-featured">
        <span className="crown-icon">👑</span> Excellent
      </div>
      <div className="badge-verified">
        <span>Certified</span> <span className="check-icon">🛡️</span>
      </div>
    </div>

    {/* CONTENT SECTION */}
    <div className="card-content">
      
      {/* Header: Name & Rating */}
      <div className="card-header-row">
        <h2 className="driver-name">Ahmed Benali</h2>
        <div className="rating-box">
          <span className="star-icon">⭐</span>
          <span className="rating-score">3.9</span>
        </div>
      </div>

      {/* Location */}
      <div className="location-row">
        <span className="icon-grey">📍</span>
        <span className="location-text">Casablanca - Rabat</span>
      </div>

      {/* Tags (Vehicle Types) */}
      <div className="tags-row">
        <span className="tag">Camio</span>
        <span className="tag">Honda</span>
      </div>

      <hr className="divider" />

      {/* Stats Row (Price & Trips) */}
      <div className="stats-row">
        <div className="price-section">
          <span className="label-small">Starting from</span>
          <div className="price-value">
            350 <span className="currency">MAD</span>
          </div>
        </div>
        <div className="trips-section">
          <span className="label-small">Number of Trips</span>
          <div className="trips-value">234</div>
        </div>
      </div>

      {/* Info List (Availability & Reviews) */}
      <div className="info-list">
        <div className="info-item">
          <span className="icon-clock">🕒</span>
          <span>Available: Available Today</span>
        </div>
        <div className="info-item">
          <span className="icon-chat">💬</span>
          <span>156 Reviews</span>
        </div>
      </div>

      {/* Action Button */}
      <button className="view-profile-btn">
        View Profile
        <span className="arrow-icon">←</span>
      </button>

    </div>
      
    </div>
  );
}
