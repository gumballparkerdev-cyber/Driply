import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getProducts } from "../api";
import { useCart } from "../context/CartContext";
import "../CSS/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadProductAndRelated = async () => {
      try {
        const currentProduct = await getProductById(id);
        setProduct(currentProduct);

        if (currentProduct?.sizes?.length) {
          setSelectedSize(currentProduct.sizes[0]);
        }

        const allProducts = await getProducts();

        const others = Array.isArray(allProducts) ? allProducts.filter(
          p => p._id !== currentProduct._id
        ) : [];

        const relevant = others
          .map(p => {
            let score = 0;

            // Safe property access
            const pCat = p.category || "";
            const cCat = currentProduct.category || "";
            const pGen = p.gender || "";
            const cGen = currentProduct.gender || "";
            const pSea = p.season || "";
            const cSea = currentProduct.season || "";

            if (pCat && pCat === cCat) score += 3;
            if (pGen && pGen === cGen) score += 2;
            if (pSea && pSea === cSea) score += 1;

            return { ...p, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);

        setRelatedProducts(relevant);
      } catch (err) {
        console.error("Failed to load related items:", err);
      }
    };

    loadProductAndRelated();
  }, [id]);


  if (!product) {
    return (
      <div className="loading-container">
        <p className="loading-text">Loading product...</p>
      </div>
    );
  }

  const sizes = product.sizes?.length ? product.sizes : ["S", "M", "L", "XL"];
  const productImages = product.images?.length ? product.images : [product.image];

  const handleAddToCart = async () => {
    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock!`);
      return;
    }

    if (product.stock === 0) {
      alert('This item is out of stock!');
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        size: selectedSize,
        quantity,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      // addToCart already handles error alert, but handle unexpected
      console.error('Add to cart error:', err);
    }
  };

  return (
    <div className="product-detail-container">
      {/* Back Button */}
      <div className="back-button-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>

      {/* Main Product Section */}
      <div className="product-detail-content">
        {/* Image Gallery */}
        <div className="image-section">
          <div className="main-image">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
            />
          </div>

          {productImages.length > 1 && (
            <div className="thumbnail-gallery">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="info-section">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>

            {/* Rating under title */}
            <div className="product-rating-section">
              <div className="rating-stars">
                {'⭐'.repeat(Math.floor(product.rating || 0))}
              </div>
              <span className="rating-info-text">
                {product.rating || 0} ({product.numReviews || 0} reviews)
              </span>
            </div>

            {/* Stock info */}
            <div className="stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            <div className="product-price">
              ${product.price}
            </div>
          </div>

          {product.description && (
            <div className="product-description">
              <p>{product.description}</p>
            </div>
          )}

          {/* Size Selection */}
          <div className="size-section">
            <label className="section-label">Select Size</label>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="quantity-section">
            <label className="section-label">Quantity</label>
            <div className="quantity-controls">
              <button
                disabled={quantity <= 1}
                onClick={() => setQuantity(q => q - 1)}
                className="qty-btn"
              >
                -
              </button>
              <span className="qty-display">{quantity}</span>
              <button
                disabled={quantity >= product.stock}
                onClick={() => setQuantity(q => q + 1)}
                className="qty-btn"
              >
                +
              </button>
            </div>
            {product.stock > 0 && quantity >= product.stock && (
              <span className="max-quantity-msg">Maximum available quantity</span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`add-to-cart-btn ${addedToCart ? 'added' : ''} ${product.stock === 0 ? 'disabled' : ''}`}
          >
            {product.stock === 0 ? 'Out of Stock' : addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>

          {/* Product Details */}
          <div className="product-details">
            <h3>Product Details</h3>
            <ul>
              <li>Premium quality fabric</li>
              <li>Perfect fit and comfort</li>
              <li>Easy care and machine washable</li>
              <li>Available in multiple sizes</li>
            </ul>
          </div>

          {/* Shipping Info */}
          <div className="shipping-info">
            <div className="info-item">
              <span className="icon">🚚</span>
              <div>
                <strong>Free Shipping</strong>
                <p>On orders over $50</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">🔄</span>
              <div>
                <strong>Easy Returns</strong>
                <p>30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Items Section */}
      {relatedProducts.length > 0 && (
        <div className="related-items-section">
          <div className="related-header">
            <h2 className="related-heading">Related Items</h2>
          </div>

          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => (
              <Link
                key={relatedProduct._id}
                to={`/product/${relatedProduct._id}`}
                className="related-product-card"
              >
                <div className="related-product-image">
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                </div>
                <div className="related-product-info">
                  <h3 className="related-product-name">{relatedProduct.name}</h3>
                  <p className="related-product-price">${relatedProduct.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;