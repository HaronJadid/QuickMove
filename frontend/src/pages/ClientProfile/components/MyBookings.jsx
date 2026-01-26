import React, { useState, useEffect } from "react";
import axios from "axios";
import TripHistoryCard from "./TripHistoryCard";
import '../style/MyBookings.css'; // Create this to handle the list layout

export default function MyBookings() {
    const API_URL = import.meta.env.VITE_API_URL;

    const userRetrieved = localStorage.getItem('user');
    const userParsed = userRetrieved ? JSON.parse(userRetrieved) : null;
    const id = userParsed?.userId;

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}api/client/${id}/bookings`);
                setBookings(res.data.demandes || []);
            } catch (err) {
                console.error('Error fetching Bookings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [id, API_URL]);

    if (loading) return <div className="status-text">Loading your bookings...</div>;

    return (
        <div className="bookings-list-container">
            {bookings.length > 0 ? (
                bookings.map((item) => (
                    <TripHistoryCard key={item.id} booking={item} />
                ))
            ) : (
                <div className="status-text">You haven't made any bookings yet.</div>
            )}
        </div>
    );
}