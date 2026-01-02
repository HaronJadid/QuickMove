import '../style/csdp.css'

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DriverProfileClientSide = ({ onBack }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverDetail = async () => {
      // 1. Get ID from localStorage
      const driverId = localStorage.getItem('driverID');
      
      if (!driverId) {
        alert("No driver selected");
        return;
      }

      try {
        // 2. Make HTTP request for info
        const res = await axios.get(`${API_URL}api/user/${driverId}`);
        console.log(res.data.userInfo)
        // Assuming your backend returns { livreur: { ... } }
        setDriver(res.data.userInfo);
      } catch (err) {
        console.error("Error fetching driver info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverDetail();
  }, [API_URL]);

  if (loading) return <div className="loading-screen">Loading Profile...</div>;
  if (!driver) return <div className="loading-screen">Driver not found.</div>;

  return (
    <div className="profile-detail-wrapper">
      <button className="back-link" onClick={onBack}>← Back to results</button>

      <div className="profile-grid">
        {/* LEFT CONTENT */}
        <div className="profile-main">
          
          {/* Header Section */}
          <div className="white-card no-padding overflow-hide">
            <div className="profile-cover"></div>
            <div className="profile-header-content">
              <img src={driver.imgUrl || 'https://via.placeholder.com/150'} alt="driver" className="profile-avatar" />
              <div className="profile-header-text">
                <div className="name-row">
                  <h3>{driver.nom}</h3>
                  {driver.isVerified && <span className="badge-v">Verified</span>}
                </div>
                <div className="stats-row">
                  <span className="star">★</span> <strong>{driver.rating || '5.0'}</strong>
                  <span className="text-muted"> ({driver.Reviews?.length || 0} reviews) • {driver.trips_count || 0} Trips completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="white-card">
            <h4 className="card-heading">About</h4>
            <p className="card-text">{driver.description || "This driver hasn't added a bio yet."}</p>
          </div>

          {/* Vehicles Section */}
          <div className="white-card">
            <h4 className="card-heading">🚚 Available Vehicles</h4>
            <div className="pill-container">
              {driver.vehicules?.map(v => (
                <span key={v.id} className="pill-tag">{v.nom}</span>
              ))}
            </div>
          </div>

          {/* Cities Section */}
          <div className="white-card">
            <h4 className="card-heading">📍 Working Cities</h4>
            <div className="pill-container">
              {/* Assuming your backend sends cities as an array of names or objects */}
              {driver.WorkingCities?.map((city, idx) => (
                <span key={idx} className="pill-tag">{city.nom || city}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="profile-sidebar">
          <div className="white-card sidebar-sticky">
            <h4 className="card-heading">Book This Driver</h4>
            <button className="btn-primary-red">
               <span className="icon">📅</span> Book now
            </button>
            
            <hr className="divider-light" />
            
            <div className="locked-contact">
              <h5 className="sub-heading">Contact Information</h5>
              <p className="small-muted">Details shared after booking confirmation.</p>
              <div className="locked-item">🔒 Available after booking</div>
              <div className="locked-item">🔒 Available after booking</div>
            </div>

            <hr className="divider-light" />

            <div className="quick-stats">
              <h5 className="sub-heading">Quick Stats</h5>
              <div className="mini-stats-grid">
                <div className="mini-box">
                  <span className="num">{driver.trips_count || 0}</span>
                  <span className="lab">Trips</span>
                </div>
                <div className="mini-box">
                  <span className="num">{driver.rating || '5.0'}</span>
                  <span className="lab">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfileClientSide;