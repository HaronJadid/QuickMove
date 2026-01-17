import React from 'react';
import { MapPin, Clock, Calendar, Check, X } from 'lucide-react';
import '../style/BookingRequestCard.css';
import axios from 'axios';
import { useState } from 'react';

const BookingRequestCard = ({ req,onAccept,onReject }) => {

  let status=useState('')
  console.log(req)

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
    <div className="booking-card">
      <div className="card-main-row">
        
        {/* Left Section: Client Info */}
        <div className="client-section">
          <img src={data.client_img} alt="client" className="client-avatar" />
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
        <button className="btn-accept" onClick={onAccept}>
          <Check size={18} /> Accept booking
        </button>
        <button className="btn-reject" onClick={onReject}>
           Reject booking
        </button>
      </div>
    </div>
  );
};

export default BookingRequestCard;