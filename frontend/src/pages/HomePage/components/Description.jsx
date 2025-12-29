import React from 'react';
import '../style/description.css';
import { useTranslation } from 'react-i18next';

export default function Description() {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      title: t('home.steps.step1_title'),
      desc: t('home.steps.step1_desc'),
      icon: ""
    },
    {
      id: 2,
      title: t('home.steps.step2_title'),
      desc: t('home.steps.step2_desc'),
      icon: ""
    },
    {
      id: 3,
      title: t('home.steps.step3_title'),
      desc: t('home.steps.step3_desc'),
      icon: ""
    },
    {
      id: 4,
      title: t('home.steps.step4_title'),
      desc: t('home.steps.step4_desc'),
      icon: ""
    }
  ];

  return (
    <div className="timeline-section">

      {/* SECTION HEADER */}
      <div className="section-header">
        <span className="subtitle">{t('home.steps.subtitle')}</span>
        <h2 className="title">{t('home.steps.title')}</h2>
        <p className="description">{t('home.steps.description')}</p>
      </div>

      {/* TIMELINE CONTAINER */}
      <div className="timeline-container">
        {/* The Vertical Line */}
        <div className="center-line"></div>

        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`timeline-item ${index % 2 === 0 ? 'left-side' : 'right-side'}`}
          >
            {/* The Red Number Circle */}
            <div className="timeline-number">{step.id}</div>

            {/* The Content Card */}
            <div className="timeline-content">
              {/*               <div className="card-icon">{step.icon}</div>
 */}              <div className="text-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>

            {/* Empty div for spacing on the other side */}
            <div className="timeline-space"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
