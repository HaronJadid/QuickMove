import React, { useEffect, useState } from 'react';
import '../style/CitiesComponent.css';
import axios from 'axios';

const CitiesComponent = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  // States for the UI tags (storing names for display)
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  
  // States for selection (storing IDs)
  const [tempDep, setTempDep] = useState("");
  const [tempArr, setTempArr] = useState("");

  // States for the Database cities list
  const [villes, setVilles] = useState([]);
  const [newCityNom, setNewCityNom] = useState(""); // Input for new city to DB

  let [addville,setAddvile]=useState(false)

  const userRetrieved = localStorage.getItem('user');
  const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
  const id = userParsed?.userId;

  // 1. Fetch cities from DB on load
  useEffect(() => {
    const fetchvilles = async () => {
      try {
        const res = await axios.get(`${API_URL}api/ville/`);
        setVilles(res.data.villes ); 
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    };
    const fetchDepCities=async ()=>{
      try {
        const res = await axios.get(`${API_URL}api/ville/driver/${id}`);
        setDepartureCities(res.data.villes ); 
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    }
    const fetchArrCities=async ()=>{
      try {
        const res = await axios.get(`${API_URL}api/ville/driver/${id}`);
        setArrivalCities(res.data.villes ); 
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    }
    fetchvilles();
   /*  fetchDepCities()
    fetchArrCities() */
  }, []);

  // 2. Function to add a brand new city to the DATABASE
  const handleCreateCityInDB = async () => {
    if (!newCityNom.trim()) return;

    try {
      const res = await axios.post(`${API_URL}api/ville/`, { nom: newCityNom });
      const addedCity = res.data.ville;
      console.log(addedCity)
      console.log(villes)
      setVilles([...villes, addedCity]);
      setNewCityNom(""); 
      alert("City added to the database successfully!");
      setAddvile(false)
    } catch (err) {
      console.error("Error creating city", err);
      alert("Failed to add city to database.");
    }
  };

  // 3. Function to add selected city from dropdown to the driver's list
  const addCity = (type) => {
    const selectedId = type === 'dep' ? tempDep : tempArr;
    
    // Find the city object to get its name
    const cityObj = villes.find(v => v.id.toString() === selectedId.toString());
    
    if (cityObj) {
      if (type === 'dep' && !departureCities.includes(cityObj.nom)) {
        setDepartureCities([...departureCities, cityObj.nom]);
        setTempDep("");
      } else if (type === 'arr' && !arrivalCities.includes(cityObj.nom)) {
        setArrivalCities([...arrivalCities, cityObj.nom]);
        setTempArr("");
      }
    }
  };

  const removeCity = (city, type) => {
    if (type === 'dep') {
      setDepartureCities(departureCities.filter(c => c !== city));
    } else {
      setArrivalCities(arrivalCities.filter(c => c !== city));
    }
  };

  return (
    <div className="cities-wrapper">
      <div className="cities-container-card">
        <h2 className="cities-title">Manage Routes</h2>
        
        

        

        <div className="cities-grid">
          {/* Departure Section */}
          <div className="city-column">
            <label className="column-label">Departure Cities</label>
            <div className="input-row">
              <select 
                value={tempDep} 
                onChange={(e) => setTempDep(e.target.value)}
                className="city-select"
              >
                <option value="" disabled>Select a city</option>
                {villes && villes.map((ville,index) => (
                  <option key={index} value={ville.id}>{ville.nom}</option>
                ))}
              </select>
              <button className="add-city-btn" onClick={() => addCity('dep')}>Add</button>
            </div>
            <div className="tags-display">
              {departureCities.map(city => (
                <div key={city} className="city-tag">
                  {city}
                  <span className="remove-icon" onClick={() => removeCity(city, 'dep')}>×</span>
                </div>
              ))}
            </div>
          </div>

          {/* Arrival Section */}
          <div className="city-column">
            <label className="column-label">Arrival Cities</label>
            <div className="input-row">
              <select 
                value={tempArr} 
                onChange={(e) => setTempArr(e.target.value)}
                className="city-select"
              >
                <option value="" disabled>Select a city</option>
                {villes && villes.map((ville,index) => (
                  <option key={index} value={ville.id}>{ville.nom}</option>
                ))}
              </select>
              <button className="add-city-btn" onClick={() => addCity('arr')}>Add</button>
            </div>
            <div className="tags-display">
              {arrivalCities.map(city => (
                <div key={city} className="city-tag">
                  {city}
                  <span className="remove-icon" onClick={() => removeCity(city, 'arr')}>×</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-actions">
           <button className="save-routes-btn">Save Changes</button>
        </div>

            <hr className="divider" />


        {/* NEW SECTION: Add to Database */}
        <div className="admin-city-section">
          <button onClick={()=>setAddvile(true)} className="addville">Don't see your city? Add it to the system</button>
          {addville&&(<div className="input-row">
            <input 
              type="text" 
              placeholder="Enter city name..." 
              value={newCityNom}
              onChange={(e) => setNewCityNom(e.target.value)}
              className="city-select" // Reusing style
            />
            <button className="add-db-btn" onClick={handleCreateCityInDB}>Create City</button>
          </div>)}
        </div>
      </div>
      
    </div>
  );
};

export default CitiesComponent;