import React, { useEffect, useState } from 'react';
import '../style/CitiesComponent.css';
import axios from 'axios';

const CitiesComponent = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  // States for the UI tags (storing city objects)
  const [ServiceCities, setServiceCities] = useState([]); // Should store objects, not just names
  
  // States for selection (storing IDs)
  const [selectedCityId, setSelectedCityId] = useState("");

  // States for the Database cities list
  const [villes, setVilles] = useState([]);
  const [newCityNom, setNewCityNom] = useState("");
  const [addville, setAddvile] = useState(false);

  const userRetrieved = localStorage.getItem('user');
  const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
  const id = userParsed?.userId;

  // 1. Fetch cities from DB on load
  useEffect(() => {
    const fetchvilles = async () => {
      try {
        const res = await axios.get(`${API_URL}api/ville/`);
        setVilles(res.data.villes || []); 
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    };
    
    const fetchServiceCities = async () => {
      try {
        const res = await axios.get(`${API_URL}api/ville/driver/${id}`);
        // Store the full city objects, not just names
        setServiceCities(res.data.villes || []);
        console.log('Service cities:', res.data.villes); 
      } catch (err) {
        console.error("Error fetching service cities", err);
      }
    };
  
    fetchvilles();
    fetchServiceCities();
  }, [id, API_URL]);

  // 2. Function to add a brand new city to the DATABASE
  const handleCreateCityInDB = async () => {
    if (!newCityNom.trim()) return;

    try {
      const res = await axios.post(`${API_URL}api/ville/`, { nom: newCityNom });
      const addedCity = res.data.ville;
      
      setVilles([...villes, addedCity]);
      setNewCityNom(""); 
      alert("City added to the database successfully!");
      setAddvile(false);
    } catch (err) {
      console.error("Error creating city", err);
      alert("Failed to add city to database.");
    }
  };

  // 3. Function to add selected city from dropdown to the driver's list
  const addCity = async () => {
    if (!selectedCityId) {
      alert("Please select a city first");
      return;
    }
    
    // Find the city object by ID
    const cityObj = villes.find(v => v.id_ville == selectedCityId);
    
    if (!cityObj) {
      alert("City not found");
      return;
    }

    // Check if already added
    const alreadyAdded = ServiceCities.some(city => city.id_ville == selectedCityId);
    if (alreadyAdded) {
      setSelectedCityId("");
      alert("The city is already added!");
      return;
    }

    try {
      // Add to backend
      const res = await axios.post(`${API_URL}api/ville/assign-livreur`, { 
        villeNom: cityObj.nom, 
        livreurId: id 
      });
      
      // Add to local state (store the full object)
      setServiceCities([...ServiceCities, cityObj]);
      setSelectedCityId("");
      alert(res.data.message);
    } catch (err) {
      console.error("Error updating service zones", err);
      alert("Failed to update service zones");
    }
  };

  const removeCity = async (cityId) => {
    try {
      const res = await axios.delete(`${API_URL}api/ville/${cityId}/driver/${id}`);
      console.log(res.data);
      
      // Remove from local state by ID
      setServiceCities(ServiceCities.filter(city => city.id_ville !== cityId));
      alert(res.data.message);
    } catch (err) {
      console.error("Error updating service zones", err);
      alert("Failed to update service zones");
    }
  };

  return (
    <div className="cities-wrapper">
      <div className="cities-container-card">
        <h2 className="cities-title">Manage Routes</h2>
        
        <div className="cities-grid">
          {/* Departure Section */}
          <div className="city-column">
            <label className="column-label">Service Zones</label>
            <div className="input-row">
              <select 
                value={selectedCityId} 
                onChange={(e) => setSelectedCityId(e.target.value)}
                className="city-select"
              >
                <option value="" disabled>Select a city</option>
                {villes.map((ville, index) => (
                  <option key={ville.id_ville} value={ville.id_ville}>
                    {ville.nom}
                  </option>
                ))}
              </select>
              <button className="add-city-btn" onClick={addCity}>Add</button>
            </div>
            <div className="tags-display">
              {ServiceCities.map((city) => (
                <div key={city.id_ville} className="city-tag">
                  {city.nom}
                  <span className="remove-icon" onClick={() => removeCity(city.id_ville)}>×</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* NEW SECTION: Add to Database */}
        <div className="admin-city-section">
          <button onClick={() => setAddvile(true)} className="addville">
            Don't see your city? Add it to the system
          </button>
          {addville && (
            <div className="input-row">
              <input 
                type="text" 
                placeholder="Enter city name..." 
                value={newCityNom}
                onChange={(e) => setNewCityNom(e.target.value)}
                className="city-select"
              />
              <button className="add-db-btn" onClick={handleCreateCityInDB}>
                Create City
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitiesComponent;