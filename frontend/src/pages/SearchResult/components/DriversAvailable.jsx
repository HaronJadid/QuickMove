import React, { useState } from 'react';
import '../style/dc.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DriverCard = ({ driver }) => {
  console.log(driver)
  const navigation=useNavigate()

  const API_URL = import.meta.env.VITE_API_URL;

  const userRetrieved = localStorage.getItem('user');
  const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
  const id = userParsed?.userId;
  let ville_depart= localStorage.getItem('ville_depart')
  let ville_arrivee=localStorage.getItem('ville_arrivee')

  const [showModal, setShowModal] = useState(false);
  
  // Booking Form State
  const [bookingData, setBookingData] = useState({
    prix: driver.prix_base || '',
    comment: '',
    dateDepartExacte: '',
    dateArriveeExacte: '',
    vehicule_id: ''
  });

  const handleBooking =async (e) => {
    e.preventDefault();
    console.log("Booking Submitted:", bookingData);
    try{
     
    const res=await axios.post(`${API_URL}api/client/${id}/book`,{ ville_depart,
    ville_arrivee,
    prix:bookingData.prix,
    comment:bookingData.comment,
    dateDepartExacte:bookingData.dateDepartExacte,
    dateArriveeExacte:bookingData.dateArriveeExacte,
    vehicule_id:bookingData.vehicule_id,
    livreur_id:driver.id})
    

   
      setShowModal(false);
      alert("Request sent to driver!");
    
  

    }catch(err){
      alert('Error occured while making request!!')
      console.error('error:',err)
    }
   
    
    
  };
  const lookupdriver=()=>{
    localStorage.setItem('driverID',driver.id)
    navigation('/lookupdriverprofile')

  }

  return (
    <div className="search-result-wrapper" dir="rtl">
      {/* --- HORIZONTAL CARD --- */}
      <div className="driver-horizontal-card">
        <div className="card-left-section" style={{cursor:'pointer'}} onClick={lookupdriver}>
          <img src={driver.imgUrl || '../../../../public/alt_img.webp'} alt="profile" className="mini-profile-pic" />
          <div className="driver-info">
            <div className="rating-stars">
              {'★'.repeat(Math.floor(driver.rating || 5))}<span className="rating-num">{driver.rating || 5}</span>
            </div>
            <h3 className="driver-username">{driver.user.prenom + ' '+ driver.user.nom}</h3>
            <div className="available-tags">
              {driver.vehicules?.map(v => (
                <span key={v.id} className="v-tag">{v.nom}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="card-right-section">
          <div className="price-tag">
            <span className="price-label">يبدأ من</span>
            <span className="price-value">{driver.prix_base || 350} درهم</span>
          </div>
          <button className="book-now-btn" onClick={() => setShowModal(true)}>
            احجز الآن ←
          </button>
        </div>
      </div>

      {/* --- BOOKING MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>تأكيد الحجز مع {driver.user.prenom +' '+ driver.user.nom}</h3>
              <button className="close-x" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleBooking} className="booking-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>الميزانية المقترحة (درهم)</label>
                  <input type="number" required value={bookingData.prix} 
                    onChange={(e) => setBookingData({...bookingData, prix: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>اختيار المركبة</label>
                  <select required value={bookingData.vehicule_id}
                    onChange={(e) =>setBookingData({...bookingData, vehicule_id: e.target.value})}>
                   
                    <option value="">اختر من مركبات السائق</option>
                    {driver.vehicules?.map(v => (
                      <option key={v.id} value={v.id}>{v.nom} ({v.capacite}kg)</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>تاريخ ووقت المغادرة</label>
                  <input type="datetime-local" required 
                    onChange={(e) => setBookingData({...bookingData, dateDepartExacte: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>تاريخ ووقت الوصول المتوقع</label>
                  <input type="datetime-local" required 
                    onChange={(e) => setBookingData({...bookingData, dateArriveeExacte: e.target.value})} />
                </div>

                <div className="form-group full-width">
                  <label>ملاحظات إضافية</label>
                  <textarea rows="3" placeholder="أضف تفاصيل عن الشحنة..."
                    onChange={(e) => setBookingData({...bookingData, comment: e.target.value})}></textarea>
                </div>
              </div>

              <button type="submit" className="confirm-booking-btn">إرسال الطلب</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverCard;