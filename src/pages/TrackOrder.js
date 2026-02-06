import React, { useState } from "react";
import "../CSS/TrackOrder.css";

function TrackOrder() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}`);
            if (!res.ok) {
                throw new Error("Order not found");
            }
            const data = await res.json();
            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="track-order-container">
            <div className="track-order-content">
                <div className="track-header">
                    <div className="track-icon">📦</div>
                    <h1 className="track-title">Track Your Order</h1>
                    <p className="track-subtitle">
                        Enter your Order ID found in your confirmation email or checkout screen
                    </p>
                </div>

                <form onSubmit={handleTrack} className="track-form">
                    <input
                        type="text"
                        placeholder="Enter Order ID (e.g., 64c9a1b2...)"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="track-input"
                    />
                    <button type="submit" disabled={loading} className="track-button">
                        {loading ? (
                            <>
                                <span className="button-spinner"></span>
                                Searching...
                            </>
                        ) : (
                            "Track Order"
                        )}
                    </button>
                </form>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        <div className="error-content">
                            <strong>Error:</strong> {error}
                            <p className="error-hint">Please check your order ID and try again</p>
                        </div>
                    </div>
                )}

                {order && (
                    <div className="order-result">
                        <div className="order-header">
                            <div className="order-id-section">
                                <span className="order-id-label">Order ID</span>
                                <span className="order-id-value">#{order._id}</span>
                            </div>
                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="order-date">
                            <span className="date-icon">📅</span>
                            <span className="date-text">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        <div className="order-items-section">
                            <h3 className="section-title">Order Items</h3>
                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <img 
                                            src={item.product?.image || 'https://via.placeholder.com/80'} 
                                            alt={item.product?.name || 'Product'} 
                                            className="order-item-image"
                                        />
                                        <div className="item-info">
                                            <span className="item-name">
                                                {item.product?.name || 'Unknown Product'}
                                            </span>
                                            <span className="item-details">
                                                Size: {item.size} • Quantity: {item.quantity}
                                            </span>
                                        </div>
                                        <span className="item-price">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="order-total">
                            <span className="total-label">Total Amount</span>
                            <span className="total-value">${order.totalAmount}</span>
                        </div>

                        {order.status === "Delivered" && (
                            <div className="delivery-note">
                                <span className="note-icon">✓</span>
                                <span>Your order has been delivered successfully!</span>
                            </div>
                        )}

                        {order.status === "Shipped" && (
                            <div className="delivery-note shipping">
                                <span className="note-icon">🚚</span>
                                <span>Your order is on its way!</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

    );
}

export default TrackOrder;