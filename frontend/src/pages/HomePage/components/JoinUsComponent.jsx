import React from 'react';
import '../style/joinus.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Joinus() {
  const { t } = useTranslation();

  return (
    <section className="cta-section">

      <div className="cta-container">

        <div className="cta-tag">
          <span>⚡</span> {t('home.joinus.tag')}
        </div>

        <h1 className="cta-title">
          {t('home.joinus.title')} <br />
          {t('home.joinus.title_sub')}
        </h1>
        <p className="cta-desc">
          {t('home.joinus.desc')}
        </p>

        <div className="cta-buttons">
          <Link to='/aboutus' className="btn-outline">
            <span>ⓘ</span> {t('home.joinus.learn_more')}
          </Link>
          <Link to='/driversignup' className="btn-green">
            <span>👤+</span> {t('home.joinus.register_driver')}
          </Link>
        </div>

        <div className="cta-features-grid">

          <div className="glass-card">
            <div className="card-icon">📈</div>
            <h3>{t('home.joinus.income_title')}</h3>
            <p>{t('home.joinus.income_desc')}</p>
          </div>

          <div className="glass-card">
            <div className="card-icon">📅</div>
            <h3>{t('home.joinus.flexibility_title')}</h3>
            <p>{t('home.joinus.flexibility_desc')}</p>
          </div>

          <div className="glass-card">
            <div className="card-icon">🛡️</div>
            <h3>{t('home.joinus.security_title')}</h3>
            <p>{t('home.joinus.security_desc')}</p>
          </div>

        </div>

      </div>
    </section>
  );
}