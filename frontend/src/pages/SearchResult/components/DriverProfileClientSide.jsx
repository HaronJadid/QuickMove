import '../style/csdp.css';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, CheckCircle, Calendar, Clock } from 'lucide-react';

const DriverProfileClientSide = () => {
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Initial Data Setup
  const [frombookings, setFrombookings] = useState(false);
  const [villes, setVilles] = useState([]);
  const [driverVilles, setDriverVilles] = useState([]);
  const [ville_depart, setVille_depart] = useState('');
  const [ville_arrivee, setVille_arrivee] = useState('');
  const [nbrTotalTrips, setNbrTotalTrips] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Parse Driver Data
  let rawDriver = location.state?.driverData;
  const [driver, setDriver] = useState(null);

  const [vehicles, setVehicles] = useState([]);
  
  const userRetrieved = localStorage.getItem('user');
  const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
  const id = userParsed?.userId;

  const [bookingData, setBookingData] = useState({
    prix: '',
    comment: '',
    dateDepartExacte: '',
    dateArriveeExacte: '',
    vehicule_id: ''
  });

  // 2. Logic to handle where the data came from (Search vs Bookings)
  useEffect(() => {
    if (rawDriver) {
      if (!rawDriver.user) {
        // Came from History/Bookings
        setFrombookings(true);
        setDriver({
          ...rawDriver,
          id: rawDriver.id || rawDriver.id_livreur,
          user: rawDriver // Mapping the root object to user for consistency
        });
      } else {
        // Came from Search Results
        setFrombookings(false);
        setDriver(rawDriver);
        setVille_depart(localStorage.getItem('ville_depart_name') || ''); // Use names for backend compatibility
        setVille_arrivee(localStorage.getItem('ville_arrivee_name') || '');
      }
    }
  }, [rawDriver]);
  console.log(driver)

  // 3. Fetch Stats and Cities
  useEffect(() => {
    if (!driver?.id) return;

    const fetchData = async () => {
      try {
        const statsRes = await axios.get(`${API_URL}api/livreur/${driver.id}/statistics`);
        setNbrTotalTrips(statsRes.data.statistics.totalCompletedTrips);

        const driverVillesRes = await axios.get(`${API_URL}api/ville/driver/${driver.id}`);
        setDriverVilles(driverVillesRes.data.villes);

        const res = await axios.get(`${API_URL}api/vehicule/driver/${driver.id}`);
        setVehicles(res.data.vehicules);
        console.log(res.data.vehicules)

        const allVillesRes = await axios.get(`${API_URL}api/ville/`);
        setVilles(allVillesRes.data.villes);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [driver?.id, API_URL]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      if(!id){
        alert('You have to log in to make a request !')
        return
      }
      const dep = new Date(bookingData.dateDepartExacte);
      const arr = new Date(bookingData.dateArriveeExacte);
      const now = new Date();

      if (dep < now) return alert("Departure date cannot be in the past!");
      if (bookingData.dateArriveeExacte && arr <= dep) return alert("Arrival must be after departure!");
      if (!ville_depart || !ville_arrivee) return alert("Please specify both cities!");

      await axios.post(`${API_URL}api/client/${id}/book`, {
        ville_depart, 
        ville_arrivee,
        prix: bookingData.prix,
        comment: bookingData.comment,
        dateDepartExacte: bookingData.dateDepartExacte,
        dateArriveeExacte: bookingData.dateArriveeExacte,
        vehicule_id: bookingData.vehicule_id,
        livreur_id: driver.id
      });

      setShowModal(false);
      alert("Request sent to driver!");
    } catch (err) {
      alert('Error occurred while making request!!');
    }
  };
  

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  if (!driver) return <div className="loading-state">Loading driver profile...</div>;

  return (
    <div className="profile-detail-page">
      <div className="profile-layout-grid">
        {/* Main Content (Left) */}
        <div className="profile-main-column">
          <div className="detail-card header-section">
            <div className="cover-bg"></div>
            <div className="header-content">
              <img src={driver.user.imgUrl || '/alt_img.webp'} alt="" className="profile-big-avatar" />
              <div className="header-text-info">
                <div className="name-verified-row">
                  <h3>{driver.user.prenom} {driver.user.nom}</h3>
                  <span className="verified-pill">Verified</span>
                </div>
                <div className="header-substats">
                  <span className="star-icon">★</span> 
                  <strong>{driver.user.rating || '5.0'}</strong> 
                </div>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h4 className="section-heading">About</h4>
            <p className="about-paragraph">{driver.about || "Professional driver available for transport."}</p>
          </div>

          <div className="detail-card">
            <h4 className="section-heading">🚚 Available Vehicles</h4>
            <div className="tags-flex">
              {vehicles?.map((v) => (
                <span key={v.id} className="yellow-tag">{v.nom} ({v.capacite} Kg)</span>
              ))}
            </div>
          </div>

          <div className="detail-card">
            <h4 className="section-heading">📍 Working Cities</h4>
            <div className="tags-flex">
              {driverVilles?.map((city, index) => (
                <span key={index} className="yellow-tag">{city.nom}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="profile-sidebar-column">
          <div className="detail-card sidebar-sticky">
            <h4 className="sidebar-heading">Book This Driver</h4>
            <button className="book-now-large-btn" onClick={() => setShowModal(true)}>
                <span className="calendar-icon">📅</span> Book now
            </button>
            <hr className="sidebar-divider" />
            <div className="contact-info-box">
              <div className="locked-field"><Mail size={12} /> Email: {driver.user.email}</div>
              <div className="locked-field"><Phone size={12} /> Phone: {driver.user.numero}</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOOKING MODAL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm booking with: <span style={{color:'red'}}>{driver.user.prenom} {driver.user.nom}</span></h3>
              <button className="close-x" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleBooking} className="booking-form">
              <div className="form-grid">
                
                {/* --- CONDITIONAL CITY SELECTS --- */}
                {frombookings && (
                  <>
                    <div className="form-group">
                      <label>City of departure <span className="required">*</span></label>
                      <select 
                        className="form-input" 
                        required 
                        value={ville_depart} 
                        onChange={(e) => setVille_depart(e.target.value)}
                      >
                        <option value="" disabled>Choose city of departure</option>
                        {villes.map((v) => <option key={v.id} value={v.nom}>{v.nom}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>City of arrival <span className="required">*</span></label>
                      <select 
                        className="form-input" 
                        required 
                        value={ville_arrivee} 
                        onChange={(e) => setVille_arrivee(e.target.value)}
                      >
                        <option value="" disabled>Choose city of arrival</option>
                        {villes.map((v) => <option key={v.id} value={v.nom}>{v.nom}</option>)}
                      </select>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Suggested price (DH) <span className="required">*</span></label>
                  <input type="number" required value={bookingData.prix} 
                    onChange={(e) => setBookingData({...bookingData, prix: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Choose vehicle <span className="required">*</span></label>
                  <select required value={bookingData.vehicule_id}
                    onChange={(e) => setBookingData({...bookingData, vehicule_id: e.target.value})}>
                    <option value="">Choose from driver's vehicles</option>
                    {vehicles?.map(v => (
                      <option key={v.id_vehicule} value={v.id_vehicule}>{v.nom} ({v.capacite}kg)</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date and time of departure <span className="required">*</span></label>
                  <input type="datetime-local" required min={getMinDateTime()}
                    value={bookingData.dateDepartExacte}
                    onChange={(e) => setBookingData({...bookingData, dateDepartExacte: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Expected Date and time of arrival</label>
                  <input type="datetime-local" min={bookingData.dateDepartExacte || getMinDateTime()} 
                    value={bookingData.dateArriveeExacte}
                    onChange={(e) => setBookingData({...bookingData, dateArriveeExacte: e.target.value})} />
                </div>

                <div className="form-group full-width">
                  <label>Additional comments</label>
                  <textarea rows="3" placeholder="Add comments about the trip..."
                    value={bookingData.comment}
                    onChange={(e) => setBookingData({...bookingData, comment: e.target.value})}></textarea>
                </div>
              </div>

              <button type="submit" className="confirm-booking-btn">Send request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverProfileClientSide;