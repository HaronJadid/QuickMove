import React from 'react';
import '../style/joinus.css';
import { Link } from 'react-router-dom';

export default function Joinus() {
  return (
    <section className="cta-section" >
      
      <div className="cta-container">
        
        <div className="cta-tag">
          <span>⚡</span>  Start now
        </div>

        <h1 className="cta-title">
         Are you a driver ? <br />
          Join our plateform and start earning
        </h1>
        <p className="cta-desc">
         Sign up as a qualified driver and get requests from hundreds of clients all over Morocco. 
        </p>

        <div className="cta-buttons">
          <Link to='/aboutus' className="btn-outline">
            <span>ⓘ</span> Learn more 
          </Link>
          <Link to='/driversignup' className="btn-green">
            <span>👤+</span> Sign up as a driver 
          </Link>
        </div>

        <div className="cta-features-grid">
          
          <div className="glass-card">
            <div className="card-icon">📈</div>
            <h3>30٪ +</h3>
            <p> Increase your income </p>
          </div>

          <div className="glass-card">
            <div className="card-icon">📅</div>
            <h3>Flexibility</h3>
            <p>Choose your own working time </p>
          </div>

          <div className="glass-card">
            <div className="card-icon">🛡️</div>
            <h3>Security</h3>
            <p> Guaranteed Payment  </p>
          </div>

        </div>

      </div>
    </section>
  );
}