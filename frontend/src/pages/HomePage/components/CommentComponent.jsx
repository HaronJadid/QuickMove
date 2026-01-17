import React from 'react';
import '../style/comment.css'

export default function ReviewCard({ 
  name = "Sara Benali ", 
  location = "Fes", 
  date = "2025/11/20", 
  text = " I used it twice, and the service was excellent everytime. The drivers are professional and the prices are reasonable. ", 
  rating = 5,
  image = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
}) {

  return (
    <div className="review-card" >
      
      {/* 1. STAR RATING */}
      <div className="review-stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
        ))}
      </div>

      {/* 2. TEXT CONTENT */}
      <p className="review-text">
        "{text}"
      </p>

      <hr className="review-divider" />

      {/* 3. FOOTER (Profile & Date) */}
      <div className="review-footer">
        
        {/* User Info */}
        <div className="user-info">
          <img src={image} alt={name} className="user-avatar" />
          <div className="user-details">
            <h4 className="user-name">{name}</h4>
            <span className="user-location">
              <span className="pin-icon">📍</span> {location}
            </span>
          </div>
        </div>

        {/* Date */}
        <span className="review-date">{date}</span>
        
      </div>
    </div>
  );
}