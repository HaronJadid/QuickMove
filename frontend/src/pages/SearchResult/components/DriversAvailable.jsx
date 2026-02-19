import React, { useState, useEffect } from 'react';
import '../style/dc.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

/* ─────────────────────────────────────────────
   AI Price Popup Component
───────────────────────────────────────────── */
function AiPricePopup({ result, loading, error, onAccept, onReject, villeDepNom, villeArrNom }) {
  return (
    <div className="ai-popup-overlay" onClick={onReject}>
      <div className="ai-popup-card" onClick={e => e.stopPropagation()}>

        {loading && (
          <div className="ai-popup-loading">
            <div className="ai-spinner" />
            <p>Calculating AI price estimate…</p>
          </div>
        )}

        {error && !loading && (
          <div className="ai-popup-error">
            <p>⚠️ {error}</p>
            <button className="btn-ai-reject" onClick={onReject}>Close</button>
          </div>
        )}

        {result && !loading && (
          <>
            <div className="ai-popup-header">
              <span className="ai-sparkle">✨</span>
              <div>
                <h4>AI Price Estimation</h4>
                <p className="ai-route-label">{villeDepNom} → {villeArrNom}</p>
              </div>
            </div>

            <div className="ai-range">
              <span className="ai-range-min">{result.estimation.min} DH</span>
              <span className="ai-range-sep">—</span>
              <span className="ai-range-max">{result.estimation.max} DH</span>
            </div>
            <p className="ai-range-hint">Suggested range based on distance &amp; vehicle</p>

            <div className="ai-details">
              <div className="ai-detail-row">
                <span>📍 Road distance</span>
                <strong>{result.details.distance_km} km</strong>
              </div>
              <div className="ai-detail-row">
                <span>⛽ Fuel ref. price</span>
                <strong>{result.details.gas_price} DH/L</strong>
              </div>
              <div className="ai-detail-row">
                <span>🧮 Base price</span>
                <strong>{result.details.base_price_calc} DH</strong>
              </div>
              {result.details.ai_analysis?.difficulty_surcharge !== '+0%' && (
                <div className="ai-detail-row surcharge">
                  <span>⚡ Difficulty surcharge</span>
                  <strong>{result.details.ai_analysis.difficulty_surcharge}</strong>
                </div>
              )}
            </div>

            <div className="ai-popup-actions">
              <button className="btn-ai-reject" onClick={onReject}>✗ Reject</button>
              <button
                className="btn-ai-accept"
                onClick={() => onAccept(Math.round((result.estimation.min + result.estimation.max) / 2))}
              >
                ✓ Accept – use {Math.round((result.estimation.min + result.estimation.max) / 2)} DH
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Driver Card Component
───────────────────────────────────────────── */
const DriverCard = ({ driver }) => {
  const navigation = useNavigate();

  const getImageUrl = (img) => {
    if (!img) return '/alt_img.webp';
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${baseUrl}${img}`;
  };

  const userRetrieved = localStorage.getItem('user');
  const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
  const id = userParsed?.userId;
  const villeDepart = localStorage.getItem('ville_depart');
  const villeArrivee = localStorage.getItem('ville_arrivee');

  const [showModal, setShowModal] = useState(false);
  const [villes, setVilles] = useState([]);

  // AI popup state
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    prix: driver.prix_base || '',
    comment: '',
    dateDepartExacte: '',
    dateArriveeExacte: '',
    vehicule_id: ''
  });

  // Fetch villes to resolve city names from IDs
  useEffect(() => {
    axios.get(`${API_URL}api/ville/`)
      .then(res => setVilles(res.data.villes || []))
      .catch(() => { });
  }, []);

  const getVilleNom = (id) => villes.find(v => String(v.id_ville ?? v.id) === String(id))?.nom || id;

  const villeDepNom = getVilleNom(villeDepart);
  const villeArrNom = getVilleNom(villeArrivee);

  /* ── AI estimate handler ── */
  const handleAiEstimate = async () => {
    if (!villeDepart || !villeArrivee) {
      setAiError('No departure / arrival city found. Please search again.');
      setShowAiPopup(true);
      return;
    }
    setAiResult(null);
    setAiError(null);
    setAiLoading(true);
    setShowAiPopup(true);
    try {
      const res = await axios.post(`${API_URL}api/ai/prix_estimee`, {
        ville_dep: villeDepNom,
        ville_darr: villeArrNom,
        vehicule: driver.vehicules?.[0]?.nom || 'Fourgon',
        rating: driver.rating || 5,
        commentaire: bookingData.comment || ''
      });
      if (res.data.success) {
        setAiResult(res.data);
      } else {
        setAiError('AI estimation failed. Try again.');
      }
    } catch (err) {
      setAiError('Could not reach the AI service. Make sure the backend is running.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiAccept = (price) => {
    setBookingData(prev => ({ ...prev, prix: price }));
    setShowAiPopup(false);
  };

  /* ── Booking submit ── */
  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const dep = new Date(bookingData.dateDepartExacte);
      const arr = new Date(bookingData.dateArriveeExacte);
      const now = new Date();

      if (dep < now) { alert('Departure date cannot be in the past!'); return; }
      if (arr <= dep) { alert('The expected date of arrival should be later than the departure date!'); return; }

      await axios.post(`${API_URL}api/client/${id}/book`, {
        ville_depart: villeDepart,
        ville_arrivee: villeArrivee,
        prix: bookingData.prix,
        comment: bookingData.comment,
        dateDepartExacte: bookingData.dateDepartExacte,
        dateArriveeExacte: bookingData.dateArriveeExacte,
        vehicule_id: bookingData.vehicule_id,
        livreur_id: driver.id
      });

      setShowModal(false);
      alert('Request sent to driver!');
    } catch (err) {
      alert('Error occurred while making request!!');
      console.error('error:', err);
    }
  };

  const lookupdriver = () => {
    localStorage.setItem('driverID', driver.id);
    navigation('/lookupdriverprofile', { state: { driverData: driver } });
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="search-result-wrapper">
      {/* ── Horizontal Card ── */}
      <div className="driver-horizontal-card">
        <div className="card-left-section" style={{ cursor: 'pointer' }} onClick={lookupdriver}>
          <img src={getImageUrl(driver.user.imgUrl)} alt="profile" className="mini-profile-pic" />
          <div className="driver-info">
            <div className="rating-stars">
              {driver.rating ? (
                <>
                  {'★'.repeat(Math.floor(driver.rating))}
                  <span className="rating-num">{driver.rating}</span>
                </>
              ) : (
                <span className="rating-num" style={{ fontSize: '0.9rem', color: '#888' }}>New Driver</span>
              )}
            </div>
            <h3 className="driver-username">{driver.user.prenom + ' ' + driver.user.nom}</h3>
            <div className="available-tags">
              {driver.vehicules?.map(v => (
                <span key={v.id} className="v-tag">{v.nom}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="card-right-section">
          <button className="book-now-btn" onClick={() => setShowModal(true)}>
            Book now ←
          </button>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm booking with {driver.user.prenom + ' ' + driver.user.nom}</h3>
              <button className="close-x" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleBooking} className="booking-form">
              <div className="form-grid">

                {/* ── Price field with AI button ── */}
                <div className="form-group">
                  <label>The suggested price (DH) <span className="required">*</span></label>
                  <div className="price-field-row">
                    <input
                      type="number"
                      required
                      value={bookingData.prix}
                      onChange={(e) => setBookingData({ ...bookingData, prix: e.target.value })}
                      placeholder="Enter price…"
                    />
                    <button
                      type="button"
                      className="btn-ai-estimate"
                      onClick={handleAiEstimate}
                      title="Estimate price with AI"
                    >
                      ✨ AI
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Choose vehicle <span className="required">*</span></label>
                  <select required value={bookingData.vehicule_id}
                    onChange={(e) => setBookingData({ ...bookingData, vehicule_id: e.target.value })}>
                    <option value="">Choose from driver's vehicles</option>
                    {driver.vehicules?.map(v => (
                      <option key={v.id} value={v.id}>{v.nom} ({v.capacite}kg)</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date and time of departure <span className="required">*</span></label>
                  <input type="datetime-local" required
                    min={getMinDateTime()}
                    value={bookingData.dateDepartExacte}
                    onChange={(e) => setBookingData({ ...bookingData, dateDepartExacte: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Expected date and time of arrival</label>
                  <input type="datetime-local"
                    min={bookingData.dateDepartExacte || getMinDateTime()}
                    value={bookingData.dateArriveeExacte}
                    onChange={(e) => setBookingData({ ...bookingData, dateArriveeExacte: e.target.value })} />
                </div>

                <div className="form-group full-width">
                  <label>Additional comments</label>
                  <textarea rows="3" placeholder="Add comments about the trip…"
                    value={bookingData.comment}
                    onChange={(e) => setBookingData({ ...bookingData, comment: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="confirm-booking-btn">Send request</button>
            </form>
          </div>

          {/* ── AI Popup (inside modal overlay context) ── */}
          {showAiPopup && (
            <AiPricePopup
              result={aiResult}
              loading={aiLoading}
              error={aiError}
              villeDepNom={villeDepNom}
              villeArrNom={villeArrNom}
              onAccept={handleAiAccept}
              onReject={() => setShowAiPopup(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DriverCard;