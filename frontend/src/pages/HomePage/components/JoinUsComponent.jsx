import React from 'react';
import '../../../assets/joinus.css';

export default function Joinus() {
  return (
    <section className="cta-section" dir="rtl">
      
      <div className="cta-container">
        
        <div className="cta-tag">
          <span>⚡</span> ابدأ الآن
        </div>

        <h1 className="cta-title">
          هل أنت سائق؟ <br />
          انضم إلى منصتنا وابدأ الربح
        </h1>
        <p className="cta-desc">
          سجل كسائق معتمد واحصل على طلبات حجز من آلاف العملاء في جميع أنحاء المغرب
        </p>

        <div className="cta-buttons">
          <button className="btn-outline">
            <span>ⓘ</span> اعرف المزيد
          </button>
          <button className="btn-green">
            <span>👤+</span> سجل كسائق
          </button>
        </div>

        <div className="cta-features-grid">
          
          <div className="glass-card">
            <div className="card-icon">📈</div>
            <h3>٣٠٪+</h3>
            <p>زيادة في الدخل</p>
          </div>

          <div className="glass-card">
            <div className="card-icon">📅</div>
            <h3>مرونة</h3>
            <p>اختر مواعيدك</p>
          </div>

          <div className="glass-card">
            <div className="card-icon">🛡️</div>
            <h3>أمان</h3>
            <p>دفع مضمون</p>
          </div>

        </div>

      </div>
    </section>
  );
}