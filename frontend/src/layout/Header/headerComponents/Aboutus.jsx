import React from 'react';
import '../headerComponentsStyle/Aboutus.css';
import { ShieldCheck, Truck, Users, TrendingUp, CheckCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function Aboutus() {
    return (
        <div className="about-page">

            {/* --- HERO SECTION --- */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>Moving Made <span className="highlight-text">Simple</span> & <span className="highlight-text">Reliable</span></h1>
                    <p>
                        QuickMove is your primary gateway to seamless transportation and logistics services across the Kingdom.
                        We connect you directly with a certified network of professional drivers to move your furniture and goods safely.
                    </p>
                </div>
            </section>

            {/* --- MISSION SECTION --- */}
            <section className="mission-section">
                <div className="mission-container">
                    <div className="mission-text">
                        <h2>Our Mission</h2>
                        <p>
                            We aim to revolutionize the moving industry in Morocco by bringing transparency, safety, and efficiency to every trip.
                            Whether you are moving a single sofa or an entire office, we ensure a hassle-free experience.
                        </p>
                    </div>
                    <div className="mission-stats">
                        <div className="stat-item">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Verified Drivers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">2k+</span>
                            <span className="stat-label">Happy Clients</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Cities Covered</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- WHY CHOOSE US GRID --- */}
            <section className="why-us-section">
                <div className="section-header">
                    <h2>Why Choose QuickMove?</h2>
                    <div className="underline"></div>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="f-icon"><MapPin size={32} /></div>
                        <h3>Customized Search</h3>
                        <p>Choose your departure and arrival city, and select the exact vehicle type (Truck, Van, Honda) that fits your load.</p>
                    </div>

                    <div className="feature-card">
                        <div className="f-icon"><ShieldCheck size={32} /></div>
                        <h3>Safety & Trust</h3>
                        <p>We work exclusively with verified drivers. View profiles, photos, and real reviews before you book.</p>
                    </div>

                    <div className="feature-card">
                        <div className="f-icon"><CheckCircle size={32} /></div>
                        <h3>Transparent Pricing</h3>
                        <p>Compare competitive offers from multiple drivers and choose the price that best fits your budget.</p>
                    </div>
                </div>
            </section>

            {/* --- FOR DRIVERS SECTION --- */}
            <section className="driver-cta-section">
                <div className="driver-cta-content">
                    <div className="driver-text">
                        <h2>Are you a Driver?</h2>
                        <p>Join our platform to increase your monthly income by over 30%. Be your own boss, choose your schedule, and get guaranteed payments.</p>
                        <ul className="driver-benefits">
                            <li><TrendingUp size={18} /> Increase your earnings</li>
                            <li><Users size={18} /> Access thousands of clients</li>
                            <li><Truck size={18} /> Flexible working hours</li>
                        </ul>
                        <Link to="/driversignup" className="btn-driver-join">Register as a Driver</Link>
                    </div>
                    <div className="driver-image-placeholder">
                        {/* You can add an illustration or image here later */}
                        <Truck size={120} strokeWidth={1} opacity={0.2} />
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Aboutus;