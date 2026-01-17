import React, { useState, useEffect } from 'react';
import '../style/DrPersonalInfo.css';
import axios from 'axios';

export default function DrPersonalInfo() {
    const API_URL = import.meta.env.VITE_API_URL;
    
    // Store complete user object
    const [user, setUser] = useState(null);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state for editing
    const [formData, setFormData] = useState({
        prenom: '',
        nom:  '',
        email:  '',
        numero:  '',
        role: "Driver Account ",
        about: '',
        cin: ''
        });

    // Get user ID from localStorage
    const userRetrieved = localStorage.getItem('user');
    const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
    const id = userParsed?.userId;

    let fetchedData={}

    // Fetch user data
    useEffect(() => {
        if (!id) {
            setError('User not logged in');
            setLoading(false);
            return;
        }

        const getinfo = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}api/user/${id}`);
                
                console.log('API Response:', res.data);
                
                // Fix: Access data correctly based on your API response structure
                const userData = res.data.userInfo || res.data;
                
                 fetchedData = {
                    prenom: userData.prenom || '',
                    nom: userData.nom || '',
                    email: userData.email || '',
                    numero: userData.numero|| '',
                    role: "Driver Account ",
                    imgUrl: userData.imgUrl || '../../../../public/alt_img.webp',
                    about:userData.livreurProfile.about|| '',
                    cin:userData.livreurProfile.cin || '',
                };
                
                setUser(fetchedData);
                setFormData({
                    prenom: fetchedData.prenom,
                    nom: fetchedData.nom,
                    email: fetchedData.email,
                    numero: fetchedData.numero,
                    about:fetchedData.about,
                    cin:fetchedData.cin,
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };
        
        getinfo();
    }, [id, API_URL]);

    const handleSave = async () => {
        try {
            // Update user data
            const updatedUser = {
                ...user,
                ...formData
            };
            
            // Send update to API
             await axios.put(`${API_URL}api/profile/driver/${id}`, formData);
             
            // Update local state
            setUser(updatedUser);
            setEdit(false);
            
            // Update localStorage if needed
            const updatedUserStorage = {
                ...userParsed,
                ...formData
            };
            localStorage.setItem('user', JSON.stringify(updatedUserStorage));
            
        } catch (err) {
            console.error('Error saving:', err);
            alert('Failed to save changes');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        // Reset form to original user data
        setFormData({
            prenom: user.prenom,
            nom: user.nom,
            email: user.email,
            numero: user.numero,
            about:user.about
        });
        setEdit(false);
    };

    // Loading state
    if (loading) {
        return <div style={{textAlign: 'center', marginTop: '50px'}}>... جاري التحميل</div>;
    }

    // Error state
    if (error) {
        return <div style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>{error}</div>;
    }

    // No user data
    if (!user) {
        return <div style={{textAlign: 'center', marginTop: '50px'}}>No user data found</div>;
    }

    return (
        <div className="profile-page-wrapper" >
            <div className="profile-card">
                <div className="profile-header">
                    <img src={user.imgUrl} alt="Profile" className="profile-avatar" />
                    <div className="role-badge">{user.role}</div>
                </div>

                <div className="profile-form">
                    <div className="input-group">
                        <label>CIN</label>
                        {!edit ? (
                            <div className="read-only-input" >{user.cin || '---'}</div>
                        ) : (
                            <input
                                type="text"
                                name="cin"
                                className="form-input"
                                value={formData.cin}
                                placeholder='Enter your CIN'
                                onChange={handleInputChange}
                            />
                        )}
                    </div>

                    <div className="input-group">
                        <label>First name</label>
                        {!edit ? (
                            <div className="read-only-input">{user.prenom}</div>
                        ) : (
                            <input
                                type="text"
                                name="prenom"
                                className="form-input"
                                value={formData.prenom}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>

                    <div className="input-group">
                        <label>Last name</label>
                        {!edit ? (
                            <div className="read-only-input">{user.nom}</div>
                        ) : (
                            <input
                                type="text"
                                name="nom"
                                className="form-input"
                                value={formData.nom}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>

                    <div className="input-group">
                        <label> Email</label>
                        {!edit ? (
                            <div className="read-only-input">{user.email}</div>
                        ) : (
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>

                    <div className="input-group">
                        <label> numero number</label>
                        {!edit ? (
                            <div className="read-only-input" dir="ltr">{user.numero}</div>
                        ) : (
                            <input
                                type="tel"
                                name="numero"
                                className="form-input"
                                value={formData.numero}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                     <div className="input-group">
                        <label>  about</label>
                        {!edit ? (
                            <div style={{minHeight:'14vh'}} className="read-only-input" dir="ltr">{user.about || 'No description provided.'}</div>
                        ) : (
                            <textarea
                                name="about"
                                className="form-input"
                                value={formData.about}
                                onChange={handleInputChange}
                                rows={4} 
                                placeholder=" Enter about..."
                            />
                        )}
                    </div>
                </div>

                <div className="profile-footer">
                    {!edit ? (
                        <button className="edit-btn" onClick={() => setEdit(true)}>
                             Edit profile
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="edit-btn" onClick={handleSave}>
                                Save
                            </button>
                            <button className="edit-btn" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}