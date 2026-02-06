import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api";
import Modelimg from "../Images/Model-img.jpg";
import "../CSS/Home.css";

function Home() {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        
        // Shuffle and pick random products
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setNewArrivals(shuffled.slice(0, 4));
        setFeaturedProducts(shuffled.slice(4, 8));
        
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-subtitle">OUR BESTSELLERS</span>
            <h1 className="hero-title">Latest Arrivals</h1>
            <Link to="/collection" className="hero-btn">
              SHOP NOW
            </Link>
          </div>
          <div className="hero-image">
            <img src={Modelimg} alt="Fashion Model" />
          </div>
        </div>
      </section>

      {/* Products Section */}
      {loading ? (
        <div className="loading-container">
          <p className="loading-text">Loading products...</p>
        </div>
      ) : (
        <>
          {/* New Arrivals */}
          <section className="products-section">
            <div className="section-header">
              <h2 className="section-title">New Arrivals</h2>
              <p className="section-subtitle">Fresh drops just in</p>
            </div>
            <div className="products-grid">
              {newArrivals.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>

          {/* Featured Products */}
          <section className="products-section">
            <div className="section-header">
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Our top picks for you</p>
            </div>
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>

          {/* Policies Section */}
          <section className="policies-section">
            <div className="policies-container">
              <div className="policy-card">
                <div className="policy-icon-wrapper">
                  <svg className="policy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
                <div className="policy-content">
                  <h3 className="policy-title">Free Shipping</h3>
                  <p className="policy-description">Free delivery on orders over $50</p>
                </div>
              </div>

              <div className="policy-card">
                <div className="policy-icon-wrapper">
                  <svg className="policy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                </div>
                <div className="policy-content">
                  <h3 className="policy-title">Secure Payment</h3>
                  <p className="policy-description">100% secure transactions</p>
                </div>
              </div>

              <div className="policy-card">
                <div className="policy-icon-wrapper">
                  <svg className="policy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <div className="policy-content">
                  <h3 className="policy-title">Easy Returns</h3>
                  <p className="policy-description">30-day hassle-free returns</p>
                </div>
              </div>

              <div className="policy-card">
                <div className="policy-icon-wrapper">
                  <svg className="policy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
                <div className="policy-content">
                  <h3 className="policy-title">24/7 Support</h3>
                  <p className="policy-description">Always here to help you</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Home;