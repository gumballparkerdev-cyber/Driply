import React from 'react'
import { Link } from 'react-router-dom'
import '../CSS/ProductCard.css'

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
        />
        
        {/* Stock Indicator */}
        {product.stock !== undefined && (
          <div className={`stock-indicator ${product.stock === 0 ? 'out' : product.stock <= 10 ? 'low' : 'in'}`}>
            {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-price-section">
          <span className="product-price">${product.price}</span>
          {product.originalPrice && (
            <>
              <span className="product-original-price">${product.originalPrice}</span>
              <span className="discount-badge">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>

        {product.rating && (
          <div className="product-rating">
            <span className="stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
            <span className="rating-text">{product.rating}</span>
            <span className="reviews-count">({product.numReviews || 0})</span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard