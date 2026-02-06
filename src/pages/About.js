import React from 'react'
import Aboutimg from '../Images/About-img.jpg'
import '../CSS/About.css'

function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <h1 className="about-title">
          <span className="title-light">ABOUT</span> <span className="title-dark">US</span>
        </h1>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <div className="content-grid">
          {/* Image Section */}
          <div className="image-section">
            <img src={Aboutimg} alt="Driply Fashion" className="about-image" />
          </div>

          {/* Text Section */}
          <div className="text-section">
            <p className="about-text">
              At Driply, fashion isn't just about what you wear — it's about how you express yourself. 
              We're an online clothing and outerwear destination built for people who want style that speaks, 
              quality that lasts, and prices that make sense.
            </p>

            <p className="about-text">
              From everyday essentials to statement pieces, our collections are designed to keep you looking 
              sharp and feeling confident, no matter the season.
            </p>

            <div className="mission-box">
              <h2 className="mission-title">Our Mission</h2>
              <p className="mission-text">
                We believe clothes should do more than cover you — they should empower you.
              </p>
              <ul className="mission-list">
                <li>Quality fabrics that feel good and last longer</li>
                <li>Trendy yet timeless designs</li>
                <li>Accessible fashion for everyone</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="why-section">
        <h2 className="why-title">
          <span className="title-light">WHY</span> <span className="title-dark">DRIPLY?</span>
        </h2>

        <div className="why-grid">
          <div className="why-card">
            <div className="card-icon">👕</div>
            <h3 className="card-title">Curated Collections</h3>
            <p className="card-text">
              Streetwear, casual, and outerwear that blend perfectly with your vibe.
            </p>
          </div>

          <div className="why-card">
            <div className="card-icon">🚀</div>
            <h3 className="card-title">Fast Delivery</h3>
            <p className="card-text">
              Get your new fits delivered straight to your door, quick and reliable.
            </p>
          </div>

          <div className="why-card">
            <div className="card-icon">💯</div>
            <h3 className="card-title">Customer First</h3>
            <p className="card-text">
              Your style journey matters to us. We're here to make it amazing.
            </p>
          </div>
        </div>

        <p className="closing-text">
          At Driply, we're not just selling clothes. We're building a community of people who know 
          that the right outfit can change the way you move through the world. 💧
        </p>
      </div>

      {/* Newsletter */}
      <div className="newsletter-section">
        <h2 className="newsletter-title">Subscribe & Get 20% Off</h2>
        <p className="newsletter-subtitle">
          Join the Driply fam and stay updated on new drops and exclusive deals.
        </p>
        <div className="newsletter-form">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="newsletter-input"
          />
          <button className="newsletter-btn">SUBSCRIBE</button>
        </div>
      </div>
    </div>
  )
}

export default About