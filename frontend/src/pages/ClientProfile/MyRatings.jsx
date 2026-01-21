import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/Authentication/components/Authprovider';
import { Star, AlertCircle, User, Edit2, Trash2, ChevronDown, MessageSquare } from 'lucide-react';
import './style/MyRatings.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const MyRatings = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [drivers, setDrivers] = useState([]); // Unique drivers from completed bookings
    const [ratings, setRatings] = useState([]); // Past ratings
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [currentRate, setCurrentRate] = useState(0);
    const [currentComment, setCurrentComment] = useState('');
    const [hoverRate, setHoverRate] = useState(0);
    const [error, setError] = useState(null);
    const [editingRatingId, setEditingRatingId] = useState(null); // If editing a rating

    // Fetch Data
    useEffect(() => {
        if (!user) return;
        fetchData();
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const clientId = user.clientId || user.userId;

            // 1. Fetch Bookings to find eligible drivers
            const bookingsRes = await axios.get(`${API_URL}api/client/${clientId}/bookings`, {
                headers: { Authorization: `Bearer ${user.accessToken}` }
            });

            // Extract eligible unique drivers (Completed bookings)
            const rawDemandes = bookingsRes.data.demandes || bookingsRes.data || [];
            const completed = rawDemandes.filter(d =>
                (d.status === 'COMPLETED' || d.statut === 'COMPLETED' || d.statut === 'Completed' || d.status === 'Completed')
                && d.driver
            );

            const uniqueDrivers = [];
            const seenIds = new Set();
            completed.forEach(d => {
                const driver = d.driver; // Expecting { id, fullName, ... } from backend update
                if (driver && driver.id && !seenIds.has(driver.id)) {
                    seenIds.add(driver.id);
                    uniqueDrivers.push(driver);
                }
            });
            setDrivers(uniqueDrivers);

            // 2. Fetch Existing Ratings
            const ratingsRes = await axios.get(`${API_URL}api/client/${clientId}/ratings`, {
                headers: { Authorization: `Bearer ${user.accessToken}` }
            });
            setRatings(ratingsRes.data || []);

        } catch (err) {
            console.error("Error loading ratings data:", err);
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!selectedDriverId && !editingRatingId) || currentRate === 0) {
            alert("Please select a driver and a star rating.");
            return;
        }

        const clientId = user.clientId || user.userId;
        try {
            if (editingRatingId) {
                // UPDATE Existing
                await axios.put(`${API_URL}api/client/${clientId}/ratings/${editingRatingId}`, {
                    rate: currentRate,
                    comment: currentComment
                }, { headers: { Authorization: `Bearer ${user.accessToken}` } });
                alert("Rating updated successfully!");
                setEditingRatingId(null);
            } else {
                // CREATE New
                await axios.post(`${API_URL}api/client/${clientId}/rate`, {
                    livreur_id: selectedDriverId,
                    rate: currentRate,
                    comment: currentComment
                }, { headers: { Authorization: `Bearer ${user.accessToken}` } });
                alert("Rating submitted successfully!");
            }

            // Reset and Reload
            setSelectedDriverId('');
            setCurrentRate(0);
            setCurrentComment('');
            fetchData(); // Refresh list

        } catch (err) {
            console.error("Error submitting rating:", err);
            alert(err.response?.data?.message || "Failed to submit rating.");
        }
    };

    const handleDelete = async (ratingId) => {
        if (!window.confirm("Are you sure you want to delete this rating?")) return;
        const clientId = user.clientId || user.userId;
        try {
            await axios.delete(`${API_URL}api/client/${clientId}/ratings/${ratingId}`, {
                headers: { Authorization: `Bearer ${user.accessToken}` }
            });
            fetchData();
        } catch (err) {
            console.error("Failed to delete", err);
            alert("Failed to delete rating.");
        }
    };

    const startEdit = (rating) => {
        setEditingRatingId(rating.id);
        setSelectedDriverId(rating.livreur_id); // Might not be needed for dropdown if we hide it, but good for state
        setCurrentRate(rating.rate);
        setCurrentComment(rating.comment || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingRatingId(null);
        setSelectedDriverId('');
        setCurrentRate(0);
        setCurrentComment('');
    };

    if (loading) return <div className="loading-state">Loading ratings...</div>;

    return (
        <div className="my-ratings-container">
            <header className="page-header">
                <h2>{t('my_ratings.title', 'My Ratings')}</h2>
                <p>Rate your drivers and view your history</p>
            </header>

            {/* ERROR STATE */}
            {error && <div className="error-message"><AlertCircle size={20} /> {error}</div>}

            {/* RATING FORM CARD */}
            <div className="rating-form-card glass-panel">
                <h3>{editingRatingId ? 'Update Rating' : 'Rate a Driver'}</h3>

                <form onSubmit={handleSubmit}>
                    {/* Driver Select - Only show if NOT editing, or show disabled if editing */}
                    {!editingRatingId && (
                        <div className="form-group">
                            <label>Select Driver</label>
                            <div className="select-wrapper">
                                <select
                                    value={selectedDriverId}
                                    onChange={(e) => setSelectedDriverId(e.target.value)}
                                    className="driver-select"
                                    required
                                >
                                    <option value="">-- Choose a driver --</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.fullName} (ID: {d.id})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="select-icon" size={16} />
                            </div>
                            {drivers.length === 0 && <p className="hint">You have no completed rides to rate yet.</p>}
                        </div>
                    )}

                    {/* Star Rating */}
                    <div className="form-group">
                        <label>Rating</label>
                        <div className="stars-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={32}
                                    className={`star-icon ${star <= (hoverRate || currentRate) ? 'filled' : ''}`}
                                    onMouseEnter={() => setHoverRate(star)}
                                    onMouseLeave={() => setHoverRate(0)}
                                    onClick={() => setCurrentRate(star)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="form-group">
                        <label>Comment (Optional)</label>
                        <textarea
                            value={currentComment}
                            onChange={(e) => setCurrentComment(e.target.value)}
                            placeholder="How was your experience?"
                            rows={3}
                            className="comment-input"
                        />
                    </div>

                    <div className="form-actions">
                        {editingRatingId && (
                            <button type="button" onClick={cancelEdit} className="cancel-btn">
                                Cancel
                            </button>
                        )}
                        <button type="submit" className="submit-btn" disabled={!editingRatingId && !selectedDriverId}>
                            {editingRatingId ? 'Update Rating' : 'Submit Rating'}
                        </button>
                    </div>
                </form>
            </div>

            {/* RATINGS HISTORY LIST */}
            <div className="ratings-history-section">
                <h3>Rating History</h3>

                <div className="history-list">
                    {ratings.length === 0 ? (
                        <div className="empty-history">
                            <MessageSquare size={40} color="#cbd5e1" />
                            <p>You haven't rated anyone yet.</p>
                        </div>
                    ) : (
                        ratings.map(rating => (
                            <div key={rating.id} className="history-card glass-panel">
                                <div className="history-header">
                                    <div className="driver-meta">
                                        <User size={18} />
                                        <span className="driver-name">
                                            {rating.evalue?.User?.nom} {rating.evalue?.User?.prenom}
                                        </span>
                                    </div>
                                    <span className="rating-date">
                                        {new Date(rating.date).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="history-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16}
                                            className={i < rating.rate ? "star-filled" : "star-empty"}
                                            fill={i < rating.rate ? "currentColor" : "none"}
                                        />
                                    ))}
                                </div>

                                {rating.comment && (
                                    <p className="history-comment">"{rating.comment}"</p>
                                )}

                                <div className="history-actions">
                                    <button onClick={() => startEdit(rating)} className="action-btn edit" title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(rating.id)} className="action-btn delete" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyRatings;
