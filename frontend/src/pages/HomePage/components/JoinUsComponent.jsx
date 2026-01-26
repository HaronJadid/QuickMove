import React from 'react';
import '../style/joinus.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TrendingUp, CalendarClock, ShieldCheck, Zap, Info, UserPlus } from 'lucide-react';

export default function Joinus() {
  const { t } = useTranslation();

  return (
    <section className="cta-section" >

      <div className="cta-container">

        <div className="cta-tag">
          <Zap size={18} fill="currentColor" />  Start now
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
            <Info size={20} /> Learn more
          </Link>
          <Link to='/driversignup' className="btn-green">
            <UserPlus size={20} /> Sign up as a driver
          </Link>
        </div>

        <div className="cta-features-grid">

          <div className="glass-card">
            <div className="card-icon">
              <TrendingUp size={32} />
            </div>
            <h3>30% +</h3>
            <p> Increase your income </p>
          </div>

          <div className="glass-card">
            <div className="card-icon">
              <CalendarClock size={32} />
            </div>
            <h3>Flexibility</h3>
            <p>Choose your own working time </p>
          </div>

          <div className="glass-card">
            <div className="card-icon">
              <ShieldCheck size={32} />
            </div>
            <h3>Security</h3>
            <p> Guaranteed Payment  </p>
          </div>

        </div>

      </div>
    </section>
  );
}