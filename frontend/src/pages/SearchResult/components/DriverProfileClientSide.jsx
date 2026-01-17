import '../style/csdp.css'
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, CheckCircle, Aperture } from 'lucide-react';


const DriverProfileClientSide= () => {
  const location = useLocation();

  let [villes,setVilles]=useState(null)
  let [driverVilles,setDriverVilles]=useState(null)

  const driver = location.state?.driverData;
  console.log(driver)
  const userRetrieved = localStorage.getItem('user');
  const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
  const id = userParsed?.userId;
  let ville_depart= localStorage.getItem('ville_depart')
  let ville_arrivee=localStorage.getItem('ville_arrivee')


  const [showModal, setShowModal] = useState(false);
  const [bookingData, setBookingData] = useState({
      prix: driver.prix_base || '',
      comment: '',
      dateDepartExacte: '',
      dateArriveeExacte: '',
      vehicule_id: ''
    });
  

  const API_URL = import.meta.env.VITE_API_URL;

  let [nbrTotalTrips,setNbrTotalTrips]=useState(null)
  useEffect(()=>{

    const getstats=async()=>{
      try{
      const response = await axios.get(`${API_URL}api/livreur/${driver.id}/statistics`);
      setNbrTotalTrips( response.data.statistics.totalCompletedTrips)

      const res=await axios.get(`${API_URL}api/ville/driver/${driver.id}`)
      setDriverVilles(res.data.villes)
      }catch(err){
        console.error('Error while fetching stats:',err)
      }
      
    }
     let fetchvilles=async()=>{
       const res= await axios.get(`${API_URL}api/ville/`)
        setVilles(res.data.villes)
        console.log(res.data)
        console.log(villes)
        
      }

    fetchvilles()
    getstats()
  },[driver.id])

   const handleBooking =async (e) => {
    e.preventDefault();
    console.log("Booking Submitted:", bookingData);
    try{
        const dep = new Date(bookingData.dateDepartExacte);
        const arr = new Date(bookingData.dateArriveeExacte);
        const now = new Date();

        // 1. Check if Departure is in the past
        if (dep < now) {
          alert("Departure date cannot be in the past!");
          return;
        }

        // 2. Check if Arrival is before Departure
        if (arr <= dep) {
          alert("The expected date of arrival should be later than the departure date!");
          return;
        }
     
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

  const getMinDateTime = () => {
  const now = new Date();
  // Adjust to local timezone string format
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
  };
   

   

  // Safety check to handle missing data
  if (!driver) return <div className="loading-state">Loading driver profile...</div>;

  return (
    <div className="profile-detail-page">
      <div className="profile-layout-grid">
        
        {/* LEFT COLUMN: Main Information */}
        <div className="profile-main-column">
          
          {/* Header Card */}
          <div className="detail-card header-section">
            <div className="cover-bg"></div>
            <div className="header-content">
              <img 
                src={driver.user.imgUrl || '../../../../public/alt_img.webp'} 
                alt={driver.user.nom} 
                className="profile-big-avatar" 
              />
              <div className="header-text-info">
                <div className="name-verified-row">
                  <h3>{driver.user.prenom + ' '+driver.user.nom}</h3>
                  <span className="verified-pill">Verified</span>
                </div>
                <div className="header-substats">
                  <span className="star-icon">★</span> 
                  <strong>{driver.user.rating || '5.0'}</strong> 
                  <span className="muted-text"> 
                    ({driver.Reviews?.length || 0} reviews) •
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="detail-card">
            <h4 className="section-heading">About</h4>
            <p className="about-paragraph">
              {driver.about || "This driver specializes in safe and reliable transport across Morocco."}
            </p>
          </div>

          {/* Available Vehicles */}
          <div className="detail-card">
            <div className="heading-with-icon">
                <span className="icon">🚚</span>
                <h4 className="section-heading">Available Vehicles</h4>
            </div>
            <div className="tags-flex">
              {driver.vehicules?.map((v, index) => (
                <span key={v.id || index} className="yellow-tag">{v.nom +'  '+v.capacite+ ' '+'Kg'}</span>
              ))}
            </div>
          </div>

          {/* Working Cities */}
          <div className="detail-card">
            <div className="heading-with-icon">
                <span className="icon">📍</span>
                <h4 className="section-heading">Working Cities</h4>
            </div>
            <div className="tags-flex">
              {driverVilles?.map((city, index) => (
                <span key={index} className="yellow-tag">{city.nom }</span>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="detail-card">
            <div className="heading-with-icon">
                <span className="icon">⭐</span>
                <h4 className="section-heading">Reviews ({driver.Reviews?.length || 0})</h4>
            </div>
            <div className="reviews-container">
              {driver.Reviews && driver.Reviews.length > 0 ? (
                driver.Reviews.map((rev, index) => (
                  <div key={index} className="review-item">
                    <div className="review-meta">
                      <div className="stars">{'★'.repeat(rev.rating || 5)}</div>
                      <span className="review-date">{rev.date || 'Jan 1, 2026'}</span>
                    </div>
                    <p className="review-comment">"{rev.comment || rev.text}"</p>
                  </div>
                ))
              ) : (
                <p className="muted-text">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Actions */}
        <div className="profile-sidebar-column">
          <div className="detail-card sidebar-sticky">
            <h4 className="sidebar-heading">Book This Driver</h4>
            
            <button className="book-now-large-btn" onClick={() => setShowModal(true)}>
                <span className="calendar-icon">📅</span> Book now
            </button>

            <hr className="sidebar-divider" />

            <div className="contact-info-box">
              <h5 className="sub-title">Contact Information</h5>
              <div className="locked-field"><Mail size={12} /> Email : {driver.user.email}</div>
              <div className="locked-field"><Phone size={12} /> Phone number: {driver.user.numero} </div>
            </div>

            <hr className="sidebar-divider" />

            <div className="quick-stats-box">
              <h5 className="sub-title">Quick Stats</h5>
              <div className="stats-mini-grid">
                <div className="stat-square">
                  <span className="stat-num">{nbrTotalTrips || 0}</span>
                  <span className="stat-label">Trips</span>
                </div>
                <div className="stat-square">
                  <span className="stat-num">{driver.rating || '5.0'}</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

       {/* --- BOOKING MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>  Confirm booking with : <span style={{color:'red'}}> {driver.user.prenom +' '+ driver.user.nom} </span></h3>
              <button className="close-x" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleBooking} className="booking-form">
              <div className="form-grid">
                <div className="form-group">
                  <label> The suggested price (DH) <span className="required">*</span></label>
                  <input type="number" required value={bookingData.prix} 
                    onChange={(e) => setBookingData({...bookingData, prix: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Choose vehicule <span className="required">*</span></label>
                  <select required value={bookingData.vehicule_id}
                    onChange={(e) =>setBookingData({...bookingData, vehicule_id: e.target.value})}>
                   
                    <option value=""> Choose from the driver´s vehicules  </option>
                    {driver.vehicules?.map(v => (
                      <option key={v.id} value={v.id}>{v.nom} ({v.capacite}kg)</option>
                    ))}
                  </select>
                </div>

               

               


                <div className="form-group">
                  <label> Date and time of departure <span className="required">*</span></label>
                  <input type="datetime-local" required 
                   min={getMinDateTime()} // Prevents picking past dates
                   value={bookingData.dateDepartExacte}
                    onChange={(e) => setBookingData({...bookingData, dateDepartExacte: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Expected Date and time of arrival   </label>
                  <input type="datetime-local" 
                   min={bookingData.dateDepartExacte || getMinDateTime()} 
                   value={bookingData.dateArriveeExacte}
                    onChange={(e) => setBookingData({...bookingData, dateArriveeExacte: e.target.value})} />
                </div>

                <div className="form-group full-width">
                  <label> Additionnal comments </label>
                  <textarea rows="3" placeholder="  Add comments about the trip ..."
                    onChange={(e) => setBookingData({...bookingData, comment: e.target.value})}></textarea>
                </div>
              </div>

              <button type="submit" className="confirm-booking-btn"> Send request</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DriverProfileClientSide;