import { useState } from 'react';
import './App.css';
import RatingModal from './components/RatingModal';
import { createEvaluation } from './services/api';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // Mock data for deliveries
  const deliveries = [
    { id: 1, date: '2025-12-28', status: 'Completed', livreur: 'Ahmed Benali', livreur_id: 1, from: 'Casablanca', to: 'Rabat' },
    { id: 2, date: '2025-12-29', status: 'Pending', livreur: 'Karim Tazi', livreur_id: 2, from: 'Marrakech', to: 'Agadir' },
    { id: 3, date: '2025-12-27', status: 'Completed', livreur: 'Sara Idrissi', livreur_id: 3, from: 'Tangier', to: 'Fes' },
  ];

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
        livreur_id: selectedDelivery.livreur_id, // Use mock ID
        client_id: 2, // Mock client ID (Matches seeded Client ID)
        demande_id: selectedDelivery.id // Mock Demande ID
      };

      await createEvaluation(payload);
      alert('Thank you! Your rating has been submitted successfully.');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <h1>My Deliveries</h1>
      <div className="delivery-list">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="delivery-card">
            <div className="delivery-info">
              <h3>Delivery #{delivery.id}</h3>
              <p><strong>Driver:</strong> {delivery.livreur}</p>
              <p>{delivery.from} ➔ {delivery.to}</p>
              <span className={`status ${delivery.status.toLowerCase()}`}>{delivery.status}</span>
            </div>

            {delivery.status === 'Completed' && (
              <button
                className="rate-btn"
                onClick={() => handleRateClick(delivery)}
              >
                Rate Driver
              </button>
            )}
          </div>
        ))}
      </div>

      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRatingSubmit}
        livreurName={selectedDelivery?.livreur}
      />
    </div>
  );
}

export default App;
