import React from 'react';
import '../style/DriverComponent.css';
import { useTranslation } from 'react-i18next';


export default function DriverComponent() {
  const { t } = useTranslation();

  return (
    <div className="driver-card">

      {/* IMAGE SECTION */}
      <div className="card-image-wrapper">
        <img
          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="Driver"
          className="driver-image"
        />

        {/* Top Badges */}
        <div className="badge-featured">
          <span className="crown-icon">👑</span> {t('home.drivers.badges.featured')}
        </div>
        <div className="badge-verified">
          <span>{t('home.drivers.badges.verified')}</span> <span className="check-icon">🛡️</span>
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
            <span className="label-small">{t('home.drivers.card.starts_from')}</span>
            <div className="price-value">
              350 <span className="currency">{t('home.drivers.card.currency')}</span>
            </div>
          </div>
          <div className="trips-section">
            <span className="label-small">{t('home.drivers.card.trips')}</span>
            <div className="trips-value">234</div>
          </div>
        </div>

        {/* Info List (Availability & Reviews) */}
        <div className="info-list">
          <div className="info-item">
            <span className="icon-clock">🕒</span>
            <span>{t('home.drivers.card.available_today')}</span>
          </div>
          <div className="info-item">
            <span className="icon-chat">💬</span>
            <span>156 {t('home.drivers.card.reviews')}</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="view-profile-btn">
          {t('home.drivers.card.view_profile')}
          <span className="arrow-icon">←</span>
        </button>

      </div>
    </div>
  );
}
