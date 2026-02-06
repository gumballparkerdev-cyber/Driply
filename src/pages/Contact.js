import React, { useState } from 'react'
import Contactimg from '../Images/Contact-img.jpg'
import '../CSS/Contact.css' 
import Swal from "sweetalert2";


function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

const handleSubmit = (e) => {
  e.preventDefault();

  // Show custom alert
  Swal.fire({
    title: "Message Sent!",
    text: "✅ Your message has been delivered successfully.",
    icon: "success",
    confirmButtonText: "Cool"
  });

  // Clear form
  setFormData({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
};


  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1 className="contact-title">
          <span className="title-light">GET IN</span> <span className="title-dark">TOUCH</span>
        </h1>
        <p className="contact-subtitle">We'd love to hear from you. Drop us a message!</p>
      </div>

      {/* Main Content */}
      <div className="contact-content">
        <div className="content-grid">
          {/* Image Section */}
          <div className="image-section">
            <img src={Contactimg} alt="Contact Driply" className="contact-image" />
            
            <div className="contact-info-box">
              <h3 className="info-title">Contact Information</h3>
              
              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>support@driply.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📱</div>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <h4>Address</h4>
                  <p>123 Fashion Street, NYC 10001</p>
                </div>
              </div>

              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">📘</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">📷</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">🐦</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">💼</a>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="form-section">
            <h2 className="form-title">Send Us a Message</h2>
            <p className="form-subtitle">Have questions? We're here to help!</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="faq-title">Quick Questions?</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>🚚 Shipping</h3>
            <p>Free shipping on orders over $50. Delivery in 3-5 business days.</p>
          </div>
          <div className="faq-card">
            <h3>🔄 Returns</h3>
            <p>Easy 30-day returns. No questions asked if you're not satisfied.</p>
          </div>
          <div className="faq-card">
            <h3>💳 Payment</h3>
            <p>We accept all major credit cards and PayPal for your convenience.</p>
          </div>
          <div className="faq-card">
            <h3>📦 Track Order</h3>
            <p>Track your order anytime with the tracking number sent to your email.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact