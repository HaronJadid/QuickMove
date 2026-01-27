import React, { useState } from 'react';
import '../headerComponentsStyle/Contactus.css'; // Make sure to create this CSS file
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';

export default function Contactus() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle form submission to backend
        console.log('Form submitted:', formData);
        alert('Thank you for contacting us! We will get back to you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">

            {/* --- HEADER --- */}
            <div className="contact-header">
                <h1>Get in <span className="highlight-text">Touch</span></h1>
                <p>Have questions? We'd love to hear from you.</p>
            </div>

            <div className="contact-container">

                {/* --- INFO COLUMN --- */}
                <div className="contact-info-col">
                    <div className="info-card">
                        <h3>Contact Information</h3>
                        <p className="info-subtitle">Fill up the form and our Team will get back to you within 24 hours.</p>

                        <div className="contact-info-item">
                            <div className="icon-box"><Phone size={20} /></div>
                            <div>
                                <span>Phone</span>
                                <p>+212 601 47 37 61</p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="icon-box"><Mail size={20} /></div>
                            <div>
                                <span>Email</span>
                                <p>quickmovesup@gmail.com</p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="icon-box"><MapPin size={20} /></div>
                            <div>
                                <span>Address</span>
                                <p>online platform</p>
                            </div>
                        </div>

                        <div className="contact-info-item">
                            <div className="icon-box"><Clock size={20} /></div>
                            <div>
                                <span>Working Hours</span>
                                <p>always available</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Mini Section */}
                    <div className="faq-mini">
                        <MessageSquare size={24} className="faq-icon" />
                        <div>
                            <h4>Need immediate help?</h4>
                            <p>Check out our FAQ section for quick answers.</p>
                        </div>
                    </div>
                </div>

                {/* --- FORM COLUMN --- */}
                <div className="contact-form-col">
                    <form onSubmit={handleSubmit} className="professional-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Your Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                required
                                placeholder="How can we help?"
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                required
                                rows="5"
                                placeholder="Write your message here..."
                                value={formData.message}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-send-message">
                            Send Message <Send size={18} />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}