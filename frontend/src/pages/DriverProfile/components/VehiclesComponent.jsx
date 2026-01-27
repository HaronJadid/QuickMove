import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import '../style/VehiclesComponent.css';
import axios from 'axios';

const VehiclesComponent = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

  const getImageUrl = (img) => {
    if (!img) return '/alt_img.webp';
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${baseUrl}${img}`;
  }

  const userRetrieved = localStorage.getItem('user');
  const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
  const livreur_id = userParsed?.userId

  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    capacite: ''
    // imgUrl removed from state, we use files
  });
  const [files, setFiles] = useState([]); // Store selected files

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${API_URL}api/vehicule/driver/${livreur_id}`);
      setVehicles(res.data.vehicules);
      console.log(res.data.vehicules)
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (livreur_id) fetchVehicles(); }, [livreur_id]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 5) {
      toast.error("You can select up to 5 images maximum.");
      return;
    }
    setFiles(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('nom', formData.nom);
      data.append('capacite', formData.capacite);
      data.append('livreur_id', livreur_id);

      // Append each file
      files.forEach(file => {
        data.append('images', file);
      });

      if (editingId) {
        // For now, edit only updates text fields as backend editVehicule doesn't handle files fully yet
        await axios.put(`${API_URL}api/vehicule/${editingId}`, { ...formData, livreur_id: livreur_id });
        toast.success("Vehicle info updated successfully! (Images update not supported in edit yet)");
      } else {
        await axios.post(`${API_URL}api/vehicule/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Vehicle added successfully!");
      }
      resetForm();
      fetchVehicles();
    } catch (err) {
      toast.error("Error saving vehicle");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this vehicle?")) {
      try {
        await axios.delete(`${API_URL}api/vehicule/${id}`, { data: { livreur_id: livreur_id } });
        toast.success("Vehicle deleted successfully");
        fetchVehicles();
      } catch (err) {
        toast.error("Failed to delete vehicle");
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nom: '', capacite: '' });
    setFiles([]);
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="vehicles-wrapper">
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
                value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
              <input
                type="number" placeholder="Capacity kg (Required)" required
                value={formData.capacite} onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="file-input-wrapper" style={{ flex: 1 }}>
                <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px', display: 'block' }}>
                  Upload Images (Max 5)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={!!editingId} // Disable file upload for edit for now
                />
                {editingId && <span style={{ fontSize: '0.8rem', color: 'orange' }}>Image editing disabled in this mode</span>}
              </div>

              <button type="submit" className="submit-btn" style={{ height: 'fit-content', alignSelf: 'flex-end' }}>
                {editingId ? 'Update Info' : 'Save'}
              </button>
            </div>
          </form>
        )}

        <div className="vehicles-list-container">
          {vehicles.length === 0 ? (
            <p className="empty-msg">No vehicles added yet.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id_vehicule} className="vehicle-row"> {/* Correct key */}
                <div className="vehicle-info">
                  <div className="v-images-grid" style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {/* Show images from association if available, else imgUrl */}
                    {v.images && v.images.length > 0 ? (
                      v.images.slice(0, 5).map((img, idx) => (
                        <img key={idx} src={getImageUrl(img.url)} alt="truck" className="v-img" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      ))
                    ) : (
                      <img src={getImageUrl(v.imgUrl)} alt="truck" className="v-img" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                    )}
                  </div>

                  <div>
                    <p className="v-name">{v.nom}</p>
                    <p className="v-cap">{v.capacite} kg</p>
                  </div>
                </div>

                <div className="vehicle-actions">
                  <button className="edit-btn" onClick={() => {
                    setEditingId(v.id_vehicule);
                    setFormData({ nom: v.nom, capacite: v.capacite });
                    // We don't populate files for edit currently
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