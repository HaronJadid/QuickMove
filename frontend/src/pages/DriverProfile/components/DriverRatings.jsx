import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../features/Authentication/components/Authprovider';
import { Star, MessageSquare, User, Calendar, AlertCircle } from 'lucide-react';
import '../style/DriverRatings.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const DriverRatings = () => {
    const { user } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchRatings = async () => {
            try {
                // Use driverId if available, fallback to roleId or userId
                // The Login controller returns: driverId, clientId, userId
                const targetId = user.driverId || user.roleId || user.userId;

                console.log("Fetching ratings for Driver ID:", targetId);

                const response = await axios.get(`${API_URL}api/livreur/${targetId}/evaluations`, {
                    headers: { Authorization: `Bearer ${user.accessToken}` }
                });

                console.log("Ratings API Response:", response.data);

                setRatings(response.data.evaluations || []);
                setAverageRating(response.data.average || 0);
            } catch (err) {
                console.error("Error fetching driver ratings:", err);
                setError("Failed to load ratings.");
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, [user]);

    if (loading) return <div className="loading-state">Loading reviews...</div>;

    if (error) {
        return (
            <div className="error-container">
                <AlertCircle size={48} color="#ef4444" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="driver-ratings-container">
            <div className="ratings-summary glass-panel">
                <div className="average-score">
                    <span className="score-value">{averageRating}</span>
                    <div className="stars-display">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={24}
                                fill={i < Math.round(averageRating) ? "#f59e0b" : "none"}
                                color={i < Math.round(averageRating) ? "#f59e0b" : "#cbd5e1"}
                            />
                        ))}
                    </div>
                </div>
                <div className="total-reviews">
                    <strong>{ratings.length}</strong> Total Reviews
                </div>
            </div>

            <div className="reviews-list">
                {ratings.length === 0 ? (
                    <div className="empty-state">
                        <MessageSquare size={48} color="#cbd5e1" />
                        <p>No ratings received yet.</p>
                    </div>
                ) : (
                    ratings.map(review => (
                        <div key={review.id} className="review-card glass-panel">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <div className="avatar-placeholder">
                                        <User size={20} color="white" />
                                    </div>
                                    <div>
                                        <h4 className="client-name">
                                            {review.client?.prenom} {review.client?.nom || 'Client'}
                                        </h4>
                                        <span className="review-date">
                                            <Calendar size={12} style={{ marginRight: 4 }} />
                                            {new Date(review.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="review-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill={i < review.rate ? "#f59e0b" : "none"}
                                            color={i < review.rate ? "#f59e0b" : "#e2e8f0"}
                                        />
                                    ))}
                                </div>
                            </div>

                            {review.comment && (
                                <div className="review-body">
                                    <p>"{review.comment}"</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DriverRatings;
