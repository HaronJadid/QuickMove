import React from 'react';
import '../style/stats.css'; 


export default function Stats() {
  return (
    <div className="dashboard-section">
      
      {/* --- STATS CARDS ROW --- */}
      <div className="stats-grid">
        
        {/* Card 1: Total Bookings */}
        <div className="stat-card">
          <span className="stat-label">Total Bookings</span>
          <h3 className="stat-value text-red">2</h3>
        </div>

        {/* Card 2: Pending */}
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <h3 className="stat-value text-black">2</h3>
        </div>

        {/* Card 3: Completed */}
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <h3 className="stat-value text-green">2</h3>
        </div>

        {/* Card 4: Total Spent */}
        <div className="stat-card">
          <span className="stat-label">Total Spent</span>
          <h3 className="stat-value text-blue">2,500 MAD</h3>
        </div>

      </div>

      
    </div>
  );
}