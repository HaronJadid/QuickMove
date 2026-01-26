import React from 'react';
import { MapPin, Calendar, Star, RotateCcw, CheckCircle } from 'lucide-react';
import '../style/TripHistoryCard.css';

const TripHistoryCard = ({ booking }) => {
  console.log(booking)
  const price = parseFloat(booking?.prix || 0).toFixed(0);
  const date = booking?.dateDepartExacte ? booking.dateDepartExacte.split('T')[0] : '2024-01-01';
  const status = booking?.status || 'COMPLETED';

  const fromCity = booking?.villeDepart?.nom || '';
  const toCity = booking?.villeArrivee?.nom || '';
  const vehicle = booking?.vehicule?.nom || '';
  const driverName = booking?.driver?.prenom + ' ' + booking?.driver?.nom || " ";

  const getStatusInfo = (s) => {
    switch (s) {
      case 'COMPLETED': return { label: 'Completed', class: 'status-completed' };
      case 'PENDING': return { label: 'Pending', class: 'status-pending' };
      case 'REJECTED': return { label: 'Rejected', class: 'status-rejected' }; // Add Rejected
      case 'CONFIRMED': return { label: 'Confirmed', class: 'status-confirmed' };
      default: return { label: s, class: 'status-pending' }; // Default fallback
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="history-list-item-container">
      <div className="booking-card-horizontal" dir="ltr">

        {/* 1. Image Section (Left) */}
        <div className="driver-avatar-box">
          <img src={booking?.livreur?.imgUrl || "/alt_img.webp"} alt="driver" />
          <div className="v-check"><CheckCircle size={14} fill="#2ecc71" color="white" /></div>
        </div>

        {/* 2. Middle Info Section */}
        <div className="booking-details-main">
          <div className="top-info">
            <h3 className="driver-name">{driverName}</h3>
            <div className="rating-row">
              <Star size={14} fill="#f1c40f" color="#f1c40f" />
              <span>{(!booking?.driver?.rating || isNaN(booking?.driver?.rating)) ? '0.0' : booking?.driver?.rating}</span>
              <span className="count">({booking?.driver?.reviewsCount || 0} reviews)</span>
              <span className="v-type">| {vehicle}</span>
            </div>
          </div>

          <div className="route-row-grid">
            <div className="route-item">
              <MapPin size={16} color="#cf3445" />
              <span>From: <strong>{fromCity}</strong></span>
            </div>
            <div className="route-item">
              <MapPin size={16} color="#27ae60" />
              <span>To: <strong>{toCity}</strong></span>
            </div>
            <div className="route-item">
              <Calendar size={16} color="#94a3b8" />
              <span>Date: {date}</span>
            </div>
          </div>
        </div>

        {/* 3. Price & Status & Action (Right Side) */}
        <div className="price-status-action">
          <div className={`side-status ${statusInfo.class}`}>
            {statusInfo.label}
          </div>
          <div className="price-display">
            <span className="amount">{price}</span>
            <span className="curr">MAD</span>
          </div>
          {/* <button className="rebook-btn-new">
            <RotateCcw size={16} /> Rebook Trip
          </button> */}
        </div>

      </div>
    </div>
  );
};

export default TripHistoryCard;