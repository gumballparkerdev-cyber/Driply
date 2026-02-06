import React, { useState } from "react";
import { checkoutCart } from "../api";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/Checkout.css";

function Checkout() {
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [error, setError] = useState(null);
    const { cart, refreshCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const itemsToCheckout = location.state?.items;

    // Form states
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("card");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Calculate totals early (before handleCheckout) - safe guard if items undefined
    const items = itemsToCheckout?.length ? itemsToCheckout : (cart || []);
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 8.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const handleCheckout = async () => {
        // Validate form
        if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || 
            !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode || !shippingInfo.country) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await checkoutCart({
                items: itemsToCheckout?.length ? itemsToCheckout : cart,
                shippingInfo,
                paymentMethod,
                totals: { subtotal, shipping, tax, total }
            });
            if (response.orderId) {
                setOrderId(response.orderId);
                // Note: refreshCart() clears entire cart. If partial checkout is needed later, adjust this logic
                refreshCart();

                // Save to local storage for guest tracking
                const guestOrders = JSON.parse(localStorage.getItem("guest_orders") || "[]");
                if (!guestOrders.includes(response.orderId)) {
                    guestOrders.push(response.orderId);
                    localStorage.setItem("guest_orders", JSON.stringify(guestOrders));
                }

            } else {
                setError(response.message || "Checkout failed");
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (orderId) {
        return (
            <div className="checkout-container">
                <div className="success-container">
                    <div className="success-icon">✓</div>
                    <h1 className="success-title">Order Placed Successfully!</h1>
                    <p className="success-message">Thank you for your purchase</p>
                    <div className="order-id-box">
                        <span className="order-id-label">Order ID:</span>
                        <span className="order-id-value">{orderId}</span>
                    </div>
                    <p className="success-info">
                        A confirmation email has been sent to {shippingInfo.email}
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="continue-shopping-btn"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="checkout-container">
                <div className="empty-cart-container">
                    <h1 className="empty-cart-title">Your cart is empty</h1>
                    <p className="empty-cart-text">Add some items to get started!</p>
                    <button onClick={() => navigate("/")} className="go-home-btn">
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="checkout-container">
            <div className="checkout-content">
                {/* Left Column - Forms */}
                <div className="checkout-left">
                    <h1 className="checkout-title">Checkout</h1>

                    {error && (
                        <div className="error-message">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Shipping Information */}
                    <div className="checkout-section">
                        <h2 className="section-title">Shipping Information</h2>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={shippingInfo.fullName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={shippingInfo.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={shippingInfo.phone}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={shippingInfo.address}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="123 Main Street, Apt 4B"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={shippingInfo.city}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="New York"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={shippingInfo.state}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="NY"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">ZIP Code *</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={shippingInfo.zipCode}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="10001"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Country *</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={shippingInfo.country}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="United States"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="checkout-section">
                        <h2 className="section-title">Payment Method</h2>
                        <div className="payment-methods">
                            <div 
                                className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                <div className="payment-radio">
                                    {paymentMethod === 'card' && <div className="radio-dot"></div>}
                                </div>
                                <div className="payment-icon">💳</div>
                                <div className="payment-info">
                                    <h3 className="payment-title">Credit/Debit Card</h3>
                                    <p className="payment-description">Visa, Mastercard, Amex</p>
                                </div>
                            </div>

                            <div 
                                className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('paypal')}
                            >
                                <div className="payment-radio">
                                    {paymentMethod === 'paypal' && <div className="radio-dot"></div>}
                                </div>
                                <div className="payment-icon">🅿️</div>
                                <div className="payment-info">
                                    <h3 className="payment-title">PayPal</h3>
                                    <p className="payment-description">Fast & secure</p>
                                </div>
                            </div>

                            <div 
                                className={`payment-method ${paymentMethod === 'cod' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('cod')}
                            >
                                <div className="payment-radio">
                                    {paymentMethod === 'cod' && <div className="radio-dot"></div>}
                                </div>
                                <div className="payment-icon">💵</div>
                                <div className="payment-info">
                                    <h3 className="payment-title">Cash on Delivery</h3>
                                    <p className="payment-description">Pay when you receive</p>
                                </div>
                            </div>
                        </div>

                        {/* Note: Card inputs below are UI-only (not stored in state or sent to backend) */}
                        {paymentMethod === 'card' && (
                            <div className="card-details">
                                <div className="form-group full-width">
                                    <label className="form-label">Card Number</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                    />
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Expiry Date</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="MM/YY"
                                            maxLength="5"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">CVV</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="123"
                                            maxLength="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="checkout-right">
                    <div className="order-summary">
                        <h2 className="summary-title">Order Summary</h2>
                        
                        <div className="summary-items">
                            {items.map((item) => (
                                <div key={item._id || item.id} className="summary-item">
                                    <div className="item-info">
                                        <span className="item-name">{item.productName || item.name}</span>
                                        <span className="item-details">
                                            Size: {item.size} • Qty: {item.quantity}
                                        </span>
                                    </div>
                                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-totals">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="checkout-btn"
                        >
                            {loading ? "Processing..." : `Place Order • $${total.toFixed(2)}`}
                        </button>

                        <div className="secure-checkout">
                            <span className="secure-icon">🔒</span>
                            <span className="secure-text">Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Checkout;