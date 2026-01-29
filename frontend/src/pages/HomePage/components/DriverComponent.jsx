import React, {useEffect,useState} from 'react';
import axios from 'axios'; // Ajout de axios
import '../style/DriverComponent.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  MessageSquare,
  ArrowRight,
  Truck
} from 'lucide-react';

export default function DriverComponent({ driver,ville_dep,ville_arr }) {
  console.log(driver.vehicules?.[0]?.nom );
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!driver) return null;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

  const getImageUrl = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${baseUrl}${img}`;
  }

  const { user, villes, vehicules } = driver;
  const displayName = user ? `${user.prenom || ''} ${user.nom || ''} `.trim() : 'Unknown Driver';
  // If we have locations, show distinct city names. If too many, truncate.
  // Assuming 'villes' is an array of objects { id, nom }
  const locationList = villes && villes.length > 0 ? villes.map(v => v.nom) : [];
  const locationDisplay = locationList.length > 0
    ? (locationList.length > 2 ? `${locationList[0]}, ${locationList[1]} +${locationList.length - 2} ` : locationList.join(' - '))
    : 'Morocco';

  const vehicleTags = vehicules ? vehicules.slice(0, 3) : [];
  const imageUrl = getImageUrl(user?.imgUrl);

  // Use fetching rating or default to 'New' if 0/null
  const ratingDisplay = driver.rating ? driver.rating : 'New';
  const reviewCount = driver.reviewCount || (driver.Reviews ? driver.Reviews.length : 0);

  const handleViewProfile = () => {
    localStorage.setItem('driverID', driver.id);
    navigate('/lookupdriverprofile', { state: { driverData: driver } });
  };


  const [prix, setPrix] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
        const fetchEstimation = async () => {
            try {
                setLoading(true);
                const res = await axios.post(`${API_URL}api/ai/prix_estimee`, {
                    ville_dep: ville_dep,
                    ville_darr: ville_arr,
                    rating: driver.rating || 2,
                    // On prend le premier véhicule du livreur
                    vehicule: driver.vehicules?.[0]?.nom 
                });
                setLoading(false)
                console.log(res);
                setPrix(res.data.estimation);
                
            } catch (err) {
                console.error("Erreur estimation pour livreur", driver.id);
            } 
        };

        if (ville_dep && ville_arr) {
            fetchEstimation();
        }
    }, [driver.id, ville_dep, ville_arr]);

  return (
    <div className="driver-card">
      {/* IMAGE SECTION */}
      <div className="card-image-wrapper">
        <img
          src={imageUrl}
          alt={displayName}
          className="driver-image"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Driver"; }}
        />

        {/* Top Badges */}
        <div className="badge-featured">
          <Crown size={14} fill="currentColor" />
          <span>Excellent</span>
        </div>
        <div className="badge-verified">
          <span>Certified</span>
          <ShieldCheck size={14} className="check-icon" />
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="card-content">

        {/* Header: Name & Rating */}
        <div className="card-header-row">
          <h2 className="driver-name">{displayName}</h2>
          <div className="rating-box">
            <Star size={16} fill="currentColor" strokeWidth={0} />
            <span className="rating-score">{ratingDisplay}</span>
          </div>
        </div>

        {/* Location */}
        <div className="location-row">
          <MapPin size={16} className="icon-grey" />
          <span className="location-text">{locationDisplay}</span>
        </div>

        {/* Tags (Vehicle Types) */}
        <div className="tags-row">
          {vehicleTags.map((v, index) => (
            <span key={index} className="tag">
              <Truck size={12} style={{ marginRight: '6px' }} />
              {v.nom}
            </span>
          ))}
          {vehicleTags.length === 0 && <span className="tag">No Vehicle</span>}
        </div>

        {/*<hr className="divider" />*/}

        {/* Stats Row (Price & Trips) 
        <div className="stats-row">
          <div className="price-section">
            <span className="label-small">Starting from</span>
            <div className="price-value">
              -- <span className="currency">MAD</span>
            </div>
          </div>
          <div className="trips-section">
            
            <span className="label-small">Number of Trips</span>
            <div className="trips-value">--</div>
          </div>
        </div>
        */}


        {/* Info List (Availability & Reviews) */}
        <div className="info-list">
          <div className="info-item">
            <Clock size={16} className="icon-clock" />
            <span>Available: Check Profile</span>
          </div>
          <div className="info-item">
            <MessageSquare size={16} className="icon-chat" />
            <span>{reviewCount} Reviews</span>
          </div>
        </div>
        <div className="price-estimation-box">
            <span className="label-small">Prix estimé par IA</span>
            <div className="price-value" style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {loading ? (
                    <span className="loading-text">Calcul...</span>
                ) : (
                    prix ? `${prix} MAD` : "-- MAD"
                )}
            </div>
        </div>

        {/* Action Button */}
        <button className="view-profile-btn" onClick={handleViewProfile}>
          View Profile
          <ArrowRight size={18} className="arrow-icon" />
        </button>

      </div>

    </div>
  );
}
