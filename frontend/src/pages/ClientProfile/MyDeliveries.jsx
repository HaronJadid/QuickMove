import React, { useState, useEffect } from 'react';
import RatingModal from '../../components/RatingModal';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/Authentication/components/Authprovider';
import { useNavigate } from 'react-router-dom';

// Create a CSS file for this page if needed, or reuse App.css classes if imported globally
import '../../App.css';

const MyDeliveries = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch deliveries on mount
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchDeliveries = async () => {
            try {
                // Adjust endpoint based on your backend routes
                // Assuming clientRoutes has: router.get('/:id/bookings', clientController.getBookingsByClient);
                const response = await axios.get(`http://localhost:3000/api/client/${user.clientId}/bookings`, {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                });
                setDeliveries(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                // Fallback to mock data if API fails (for demo purposes) or show error
                // setDeliveries([]); 
                setError("Failed to load deliveries.");
                setLoading(false);
            }
        };

        fetchDeliveries();
    }, [user, navigate]);


    const handleRateClick = (delivery) => {
        setSelectedDelivery(delivery);
        setIsModalOpen(true);
    };

    const handleRatingSubmit = async ({ rate, comment }) => {
        if (!selectedDelivery) return;

        try {
            const payload = {
                rate,
                comment,
                livreur_id: selectedDelivery.livreur_id || selectedDelivery.driverId, // Adjust field name based on API response
                demande_id: selectedDelivery.id // Adjust field name
            };

            await axios.post('http://localhost:3000/api/evaluations', payload, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            });

            alert(t('rating_success', 'Thank you! Your rating has been submitted successfully.'));
            setIsModalOpen(false);
            // Optionally refresh list or update local state to hide rate button
        } catch (error) {
            console.error('Failed to submit rating:', error);
            alert(t('rating_error', 'Failed to submit rating. Please try again.'));
        }
    };

    if (loading) return <div className="app-container" style={{ marginTop: '100px' }}>Loading...</div>;
    if (error) return <div className="app-container" style={{ marginTop: '100px' }}>{error}</div>;

    return (
        <div className="app-container" style={{ marginTop: '100px' }}>
            <h2>{t('my_deliveries.title')}</h2>
            <div className="delivery-list">
                {deliveries.length === 0 ? (
                    <p>{t('my_deliveries.no_deliveries', 'No deliveries found.')}</p>
                ) : (
                    deliveries.map((delivery) => (
                        <div key={delivery.id} className="delivery-card">
                            <div className="delivery-info">
                                <h3>{t('my_deliveries.delivery_num', { id: delivery.id })}</h3>
                                <p><strong>{t('my_deliveries.driver')}:</strong> {delivery.livreurName || delivery.id_livreur}</p>
                                <p>{delivery.villeDepart} ➔ {delivery.villeArrivee}</p>
                                <span className={`status ${delivery.statut.toLowerCase()}`}>{delivery.statut}</span>
                            </div>

                            {/* Show rate button only for completed deliveries */}
                            {(delivery.statut === 'Completed' || delivery.statut === 'Terminé') && (
                                <button
                                    className="rate-btn"
                                    onClick={() => handleRateClick(delivery)}
                                >
                                    {t('my_deliveries.rate_btn')}
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            <RatingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleRatingSubmit}
                livreurName={selectedDelivery?.livreurName}
            />
        </div>
    );
};

export default MyDeliveries;
