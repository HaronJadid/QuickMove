import React from 'react';
import '../style/description.css';

export default function Description() {
  
  const steps = [
    {
      id: 1,
      title: "Look for a driver",
      desc: " Choose the city of departure and arrival depending on your needs.  ",
      icon: ""
    },
    {
      id: 2,
      title: "Compare and choose",
      desc: "Look up  the drivers available, check the prices and the reviews.",
      icon: ""
    },
    {
      id: 3,
      title: " Book your trip",
      desc: "Choose the driver you want and fill the request form with the requested information.",
      icon: ""
    },
    {
      id: 4,
      title: "Enjoy the service ",
      desc: "The driver will arrive in the determined time to move your furniture ",
      icon: ""
    }
  ];

  return (
    <div className="timeline-section" >
      
      {/* SECTION HEADER */}
      <div className="section-header">
        <span className="subtitle">How It works💡</span>
        <h2 className="title">Simple Steps </h2>
        <p className="description"> A quick and easy booking procedure to get the best furniture moving service </p>
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