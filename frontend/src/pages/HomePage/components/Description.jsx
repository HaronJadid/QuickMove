import React from 'react';
import '../style/description.css';

export default function Description() {
  
  const steps = [
    {
      id: 1,
      title: "ابحث عن سائق",
      desc: "اختر مدينة المغادرة والوصول ونوع المركبة المناسبة لاحتياجاتك",
      icon: ""
    },
    {
      id: 2,
      title: "قارن واختر",
      desc: "استعرض طلبات السائقين المتاحين وقارن الأسعار والتقييمات",
      icon: ""
    },
    {
      id: 3,
      title: "احجز رحلتك",
      desc: "اختر السائق المناسب وأكمل الحجز بخطوات بسيطة",
      icon: ""
    },
    {
      id: 4,
      title: "استمتع بالخدمة",
      desc: "السائق سيصل في الموعد المحدد، لنقل أثاثك بأمان",
      icon: ""
    }
  ];

  return (
    <div className="timeline-section" dir="rtl">
      
      {/* SECTION HEADER */}
      <div className="section-header">
        <span className="subtitle">كيف يعمل 💡</span>
        <h2 className="title">خطوات بسيطة</h2>
        <p className="description">عملية حجز سهلة وسريعة للحصول على أفضل خدمة نقل أثاث</p>
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