import React from 'react';
import { Mail, Phone, MapPin, CheckCircle,Calendar } from 'lucide-react';
import '../style/bookings.css';

const CompletedTripCard = ({ req }) => {
  return (
    <div className="booking-card completed-card">
      <div className="card-badge done-badge">Completed</div>
      
      <div className="card-main-row">
        {/* Left Section: Client & Route */}
        <div className="client-section muted-section">
          <img 
            src={req.client.imgUrl || 'https://placehold.co/100x100?text=User'} 
            className="client-avatar grayscale-img" 
            alt="client" 
          />
          <div className="client-details">
            <h3 className="client-name">{req.client.prenom} {req.client.nom}</h3>
            <div className="trip-route-summary">
                <MapPin size={14} /> {req.villeDepart} → {req.villeArrivee}
            </div>

            <div className="info-item" style={{display:'block'}}>
            <Calendar size={14} />
            <span>  {req.dateDepartExacte.split('T')[0] || ""}</span>
          </div>
            
          </div>
        </div>
        
         
        
        {/* Middle Section: Contact Info */}
        <div className="contact-details-box muted-contact">
           <div className="contact-item"><Mail size={12} /> {req.client.email}</div>
           <div className="contact-item"><Phone size={12} /> {req.client.numero}</div>
        </div>

        {/* Right Section: Price & Status */}
        <div className="price-section text-right">
          <h2 className="price-text gray-price">{req.prix} MAD</h2>
          <div className="success-status">
             Success <CheckCircle size={14} color="#27ae60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedTripCard;