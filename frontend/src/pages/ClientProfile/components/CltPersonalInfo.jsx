import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import '../style/CltPersonalInfo.css';
import axios from 'axios';

export default function CltPersonalInfo() {
    const API_URL = import.meta.env.VITE_API_URL;

    // Core States
    const [user, setUser] = useState(null);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state for editing
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        numero: '',
        role: "Customer Account",
        cin: ''
    });

    // Get user ID from localStorage
    const userRetrieved = localStorage.getItem('user');
    const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
    const id = userParsed?.userId;

    // Fetch user data
    useEffect(() => {
        if (!id) {
            setError('User session not found');
            setLoading(false);
            return;
        }

        const getinfo = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}api/user/${id}`);

                const userData = res.data.userInfo;

                // Map API data to our local state
                const fetchedData = {
                    prenom: userData.prenom || '',
                    nom: userData.nom || '',
                    email: userData.email || '',
                    numero: userData.numero || '',
                    role: "Customer Account",
                    imgUrl: userData.imgUrl
                        ? (userData.imgUrl.startsWith('http') ? userData.imgUrl : `${API_URL}${userData.imgUrl.startsWith('/') ? userData.imgUrl.slice(1) : userData.imgUrl}`)
                        : '../../../../public/alt_img.webp',
                    // Accessing nested livreurProfile fields
                    cin: userData.clientProfile?.cin || '',
                };

                setUser(fetchedData);
                setFormData({
                    prenom: fetchedData.prenom,
                    nom: fetchedData.nom,
                    email: fetchedData.email,
                    numero: fetchedData.numero,
                    cin: fetchedData.cin,
                });
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load personal information');
            } finally {
                setLoading(false);
            }
        };

        getinfo();
    }, [id, API_URL]);

    const handleSave = async () => {
        try {
            // Send update to the driver profile specific route
            await axios.put(`${API_URL}api/profile/client/${id}`, formData);

            // Sync the display user state with the form data
            setUser(prev => ({ ...prev, ...formData }));
            setEdit(false);
            toast.success('Profile updated successfully! ✅');

        } catch (err) {
            console.error('Error saving changes:', err);
            toast.error('Failed to save changes. Please check your connection.');
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
        // Revert form data to the last saved user data
        setFormData({
            prenom: user.prenom,
            nom: user.nom,
            email: user.email,
            numero: user.numero,
            about: user.about,
            cin: user.cin
        });
        setEdit(false);
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

    return (
        <div className="profile-page-wrapper" dir="ltr">
            <div className="profile-card">

                <div className="profile-header">
                    <img src={user.imgUrl} alt="Profile" className="profile-avatar" />
                    <div className="role-badge">{user.role}</div>
                </div>

                <div className="profile-form">
                    {/* CIN Field */}
                    <div className="input-group">
                        <label>CIN</label>
                        {!edit ? (
                            <div className="read-only-input">{user.cin || '---'}</div>
                        ) : (
                            <input
                                type="text"
                                name="cin"
                                className="read-only-input"
                                value={formData.cin}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>

                    {/* First Name Field */}
                    <div className="input-group">
                        <label>First name</label>
                        {!edit ? (
                            <div className="read-only-input">{user.prenom}</div>
                        ) : (
                            <input
                                type="text"
                                name="prenom"
                                className="read-only-input"
                                value={formData.prenom}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>

                    {/* Last Name Field */}
                    <div className="input-group">
                        <label>Last name</label>
                        {!edit ? (
                            <div className="read-only-input">{user.nom}</div>
                        ) : (
                            <input
                                type="text"
                                name="nom"
                                className="read-only-input"
                                value={formData.nom}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="input-group">
                        <label>Email</label>
                        {!edit ? (
                            <div className="read-only-input">{user.email}</div>
                        ) : (
                            <input
                                type="email"
                                name="email"
                                className="read-only-input"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>

                    {/* Phone Number Field */}
                    <div className="input-group">
                        <label>Phone number</label>
                        {!edit ? (
                            <div className="read-only-input">{user.numero}</div>
                        ) : (
                            <input
                                type="tel"
                                name="numero"
                                className="read-only-input"
                                value={formData.numero}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>


                </div>

                <div className="profile-footer">
                    {!edit ? (
                        <button className="edit-btn" onClick={() => setEdit(true)}>
                            Update profile
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