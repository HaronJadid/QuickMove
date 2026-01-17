import React from 'react';
import { MapPin, Clock, Check, Mail, Phone,Calendar } from 'lucide-react';
import '../style/bookings.css';

const UpcomingTripCard = ({ req, onFinish }) => {
    const data =  {
    client_name: (req.client.prenom + ' '+ req.client.nom) ||"",
    client_img: req.client.imgUrl || '../../../../public/alt_img.webp',
    vehicle_name: req.vehicule.nom ||"",
    price:req.prix || "",
    from_city:req.villeDepart || "",
    to_city: req.villeArrivee || "",
    comment:req.comment||'',
    time:req.dateDepartExacte.split('T')[1].split('.')[0].split(':').slice(0,-1).join(':') || "",
    date:req.dateDepartExacte.split('T')[0] || "",
    email:req.client.email,
    numero:req.client.numero,
    status:req.status,
    arrivaldate:req.dateArriveeExacte.split('T')[0]|| ''
  };


  return (
    <div className="booking-card upcoming-card">
      <div className="card-main-row">
        {/* Left: Client Info */}
        <div className="client-section">
          <img 
            src={req.client.imgUrl || 'https://placehold.co/100x100?text=User'} 
            className="client-avatar" 
            alt="client" 
          />
          <div className="client-details">
            <h3 className="client-name">{req.client.prenom} {req.client.nom}</h3>
            <div className="info-grid">
              <div className="info-item"><MapPin size={14} className="icon-red" /> {req.villeDepart}</div>
              <div className="info-item"><MapPin size={14} className="icon-green" /> {req.villeArrivee}</div>
               
              <div className="info-item">
                <Calendar size={14} />
                <span>{data.date}</span>
              </div>
              <div className="info-item">
                <Clock size={14} />
                <span>{data.time}</span>
              </div>
              <div className="info-item" >
                <Calendar size={14} />Expected arrival date : 
                <span>{data.arrivaldate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Contact Info */}
        <div className="contact-details-box">
           <div className="contact-item"><Mail size={12} color="#6366f1"/> {req.client.email}</div>
           <div className="contact-item"><Phone size={12} color="#db2777"/> {req.client.numero}</div>
        </div>

        {/* Right: Badge and Price (Combined to fix overlap) */}
        <div className="price-status-container">
          <div className="status-badge upcoming-badge">UPCOMING</div>
          <h2 className="price-text-large">{req.prix} MAD</h2>
        </div>
      </div>

      {req.comment && (
        <div className="comment-section">
          <h4 className="comment-title">Client comment :</h4>
          <p className="comment-body">{req.comment}</p>
        </div>
      )}

      <div className="card-actions-row">
        <button className="btn-finish-action" onClick={onFinish}>
          <Check size={18} /> Mark as Completed
        </button>
      </div>
    </div>
  );
};

export default UpcomingTripCard;