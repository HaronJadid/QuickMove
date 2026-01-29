import React from 'react';
import { MapPin, Clock, Calendar, Check, X } from 'lucide-react';
import '../style/BookingRequestCard.css';
import axios from 'axios';
import { useState } from 'react';

const BookingRequestCard = ({ req, onAccept, onReject }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

  let status = useState('')

  const rawImgUrl = req.client?.imgUrl;
  const computedImgUrl = rawImgUrl
    ? (rawImgUrl.startsWith('http') ? rawImgUrl : `${API_URL.replace(/\/$/, '')}${rawImgUrl.startsWith('/') ? '' : '/'}${rawImgUrl}`)
    : "/alt_img.webp";

  const data = {
    client_name: (req.client.prenom + ' ' + req.client.nom) || "Unknown Client",
    client_img: computedImgUrl,
    vehicle_name: req.vehicule.nom || "",
    price: req.prix || "",
    from_city: req.villeDepart || "",
    to_city: req.villeArrivee || "",
    comment: req.comment || '',
    time: req.dateDepartExacte.split('T')[1].split('.')[0].split(':').slice(0, -1).join(':') || "",
    date: req.dateDepartExacte.split('T')[0] || "",
    email: req.client.email,
    numero: req.client.numero,
    status: req.status,
    arrivaldate: req.dateArriveeExacte.split('T')[0] || ''
  };

  return (
    <div className="driver-booking-req-card">
      <div className="card-main-row">

        {/* Left Section: Client Info */}
        <div className="client-section">
          <img
            src={data.client_img}
            alt="client"
            className="client-avatar"
            onError={(e) => { e.target.onerror = null; e.target.src = "/alt_img.webp"; }}
          />
          <div className="client-details">
            <h3 className="client-name">{data.client_name}</h3>
            <div className="info-grid">
              <div className="info-item">
                <MapPin size={14} className="icon-red" />
                <span>From: {data.from_city}</span>
              </div>
              <div className="info-item">
                <MapPin size={14} className="icon-green" />
                <span>To: {data.to_city}</span>
              </div>

              <div className="info-item">
                <Calendar size={14} />
                <span>{data.date}</span>
              </div>
              <div className="info-item">
                <Clock size={14} />
                <span>{data.time}</span>
              </div>

            </div>

            <div className="info-item">
              <Calendar size={14} />Expected arrival date :
              <span>{data.arrivaldate}</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Vehicle */}
        <div className="vehicle-section">
          <h2 className="vehicle-name">{data.vehicle_name}</h2>
        </div>

        {/* Right Section: Price */}
        <div className="price-section">
          <h2 className="price-text">{data.price} MAD</h2>
        </div>
      </div>

      {data.comment && <div className="comment-box">
        <h2 className="comment">Client comment : </h2>
        <p>{data.comment}</p>
      </div>}

      {/* Action Buttons Row */}
      <div className="card-actions">
        <button className="btn-accept" >
          <a
            href={`https://wa.me/+212${data.numero}?text=${encodeURIComponent(`Bonjour, je vous contacte via QuickMove, concernant le prix ${data.prix}DH, ca me convient pas!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accept"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Check size={18} /> Envoyer sur WhatsApp
          </a>
          
        </button>

        <button className="btn-accept" onClick={onAccept}>
          <Check size={18} /> Accept booking
        </button>
        <button className="btn-reject" onClick={onReject}>
          <X size={18} /> Reject booking
        </button>
      </div>
    </div>
  );
};

export default BookingRequestCard;