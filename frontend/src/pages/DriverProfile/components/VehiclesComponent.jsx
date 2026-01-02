import React, { useEffect, useState } from 'react';
import '../style/VehiclesComponent.css';
import axios from 'axios';

const VehiclesComponent = () => {
  const API_URL = import.meta.env.VITE_API_URL;

    const userRetrieved = localStorage.getItem('user');
    const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
    const livreur_id = userParsed?.userId

  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    imgUrl: '',
    capacite: ''
  });

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${API_URL}api/vehicule/driver/${livreur_id}`);
      setVehicles(res.data.vehicules);
      console.log(res.data.vehicules)
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (livreur_id) fetchVehicles(); }, [livreur_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}api/vehicule/${editingId}`, { ...formData, livreur_id: livreur_id });
      } else {
        await axios.post(`${API_URL}api/vehicule/`, { ...formData, livreur_id: livreur_id });
      }
      resetForm();
      fetchVehicles();
    } catch (err) { alert("Error saving vehicle"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this vehicle?")) {
      await axios.delete(`${API_URL}api/vehicule/${id}`, { data: { livreur_id: livreur_id } });
      fetchVehicles();
    }
  };

  const resetForm = () => {
    setFormData({ nom: '', imgUrl: '', capacite: '' });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="vehicles-wrapper">
      {/* THIS IS THE WHITE CARD CONTAINER */}
      <div className="vehicles-main-card">
        
        <div className="vehicles-card-header">
          <h2 className="card-title">My Vehicles</h2>
          <button className="add-vehicle-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? '× Close' : '+ Add Vehicle'}
          </button>
        </div>

        {showForm && (
          <form className="vehicle-form-box" onSubmit={handleSubmit}>
            <div className="form-row">
              <input 
                type="text" placeholder="Vehicle Name (Required)" required
                value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
              <input 
                type="number" placeholder="Capacity kg (Required)" required
                value={formData.capacite} onChange={(e) => setFormData({...formData, capacite: e.target.value})}
              />
            </div>
            <div className="form-row">
              <input 
                type="text" placeholder="Image URL (Optional)" 
                value={formData.imgUrl} onChange={(e) => setFormData({...formData, imgUrl: e.target.value})}
              />
              <button type="submit" className="submit-btn">
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        )}

        <div className="vehicles-list-container">
          {vehicles.length === 0 ? (
            <p className="empty-msg">No vehicles added yet.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} className="vehicle-row">
                <div className="vehicle-info">
                  <img src={v.imgUrl || 'https://via.placeholder.com/50'} alt="truck" className="v-img" />
                  <div>
                    <p className="v-name">{v.nom}</p>
                    <p className="v-cap">{v.capacite} kg</p>
                  </div>
                </div>
                
                <div className="vehicle-actions">
                  <button className="edit-btn" onClick={() => {
                    setEditingId(v.id_vehicule);
                    setFormData({ nom: v.nom, imgUrl: v.imgUrl, capacite: v.capacite });
                    setShowForm(true);
                  }}>Modify</button>
                  <button className="delete-btn" onClick={() => handleDelete(v.id_vehicule)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default VehiclesComponent;