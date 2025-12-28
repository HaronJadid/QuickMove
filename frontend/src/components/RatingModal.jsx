import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import './RatingModal.css'; // We will create this simple CSS file

const RatingModal = ({ isOpen, onClose, onSubmit, livreurName }) => {
    const [rate, setRate] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rate === 0) {
            alert('Please select a rating');
            return;
        }
        onSubmit({ rate, comment });
        // Reset after submit
        setRate(0);
        setComment('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2>Rate Driver</h2>
                {livreurName && <p className="driver-name">Driver: {livreurName}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="rating-container">
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;

                            return (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => setRate(ratingValue)}
                                        style={{ display: 'none' }}
                                    />
                                    <Star
                                        className="star"
                                        size={32}
                                        color={ratingValue <= (hover || rate) ? "#ffc107" : "#e4e5e9"}
                                        fill={ratingValue <= (hover || rate) ? "#ffc107" : "none"}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </label>
                            );
                        })}
                    </div>

                    <div className="comment-container">
                        <textarea
                            placeholder="Leave a comment (optional)..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                        />
                    </div>

                    <button type="submit" className="submit-btn">Submit Rating</button>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
