import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../CSS/Orders.css";

function Orders() {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                let fetchedOrders = [];

                if (user && token) {
                    // 1. Logged In: Fetch from API
                    const res = await fetch(`http://localhost:5000/api/auth/orders/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) fetchedOrders = await res.json();

                } else {
                    // 2. Guest: Fetch from LocalStorage
                    const guestOrderIds = JSON.parse(localStorage.getItem("guest_orders") || "[]");

                    if (guestOrderIds.length > 0) {
                        // Fetch details for each ID
                        const promises = guestOrderIds.map(id =>
                            fetch(`http://localhost:5000/api/orders/${id}`).then(res => res.json())
                        );
                        // Filter out any failed requests (e.g. 404s)
                        const results = await Promise.all(promises);
                        fetchedOrders = results.filter(order => order && order._id);
                        // Sort locally since API wont do it for us here
                        fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    }
                }
                setOrders(fetchedOrders);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, token]);

    // Track Order State
    const [trackId, setTrackId] = useState("");
    const [trackedOrder, setTrackedOrder] = useState(null);
    const [trackError, setTrackError] = useState(null);
    const [trackLoading, setTrackLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!trackId.trim()) return;

        setTrackError(null);
        setTrackedOrder(null);
        setTrackLoading(true);

        try {
            const res = await fetch(`http://localhost:5000/api/orders/${trackId}`);
            if (!res.ok) throw new Error("Order not found");
            const data = await res.json();
            setTrackedOrder(data);
        } catch (err) {
            setTrackError(err.message);
        } finally {
            setTrackLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="orders-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <div className="orders-container">
            <div className="orders-content">
                {/* Order History Section (Now Top) */}
                <div className="order-history-section">
                    <div className="history-header">
                        <h1 className="history-title">My Orders</h1>
                        {user && <p className="welcome-text">Welcome back, {user.name}!</p>}
                        {!user && <p className="guest-text">Showing orders placed from this browser</p>}
                    </div>

                    {orders.length === 0 ? (
                        <div className="empty-orders">
                            <div className="empty-icon">📦</div>
                            <h2 className="empty-title">No Orders Yet</h2>
                            <p className="empty-text">
                                {user
                                    ? "Start shopping to see your orders here!"
                                    : "Sign in to sync your orders across devices"}
                            </p>
                        </div>
                    ) : (
                        <div className="orders-grid">
                            {orders.map((order) => (
                                <div key={order._id} className="order-card">
                                    <div className="order-card-header">
                                        <div className="order-id-section">
                                            <span className="order-id-label">Order ID</span>
                                            <span className="order-id-value">#{order._id}</span>
                                        </div>
                                        <span className={`order-status ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* Using same styling as Track Order result */}
                                    <div className="tracked-items" style={{ marginTop: '15px' }}>
                                        {order.items.map((item, index) => (
                                            <div key={index} className="tracked-item">
                                                <img
                                                    src={item.product?.image || 'https://via.placeholder.com/60'}
                                                    alt={item.product?.name || 'Product'}
                                                    className="tracked-item-image"
                                                />
                                                <div className="tracked-item-info">
                                                    <span className="tracked-item-name">
                                                        {item.product?.name || 'Unknown Product'}
                                                    </span>
                                                    <span className="tracked-item-details">
                                                        Size: {item.size} • Qty: {item.quantity}
                                                    </span>
                                                </div>
                                                <span className="tracked-item-price">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-card-footer">
                                        <div className="order-info-row">
                                            <span className="info-label">Order Date</span>
                                            <span className="info-value">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <div className="order-info-row total">
                                            <span className="info-label">Total</span>
                                            <span className="info-value">${order.totalAmount}</span>
                                        </div>

                                        {/* Confirm Receipt Button (Demo Mode) */}
                                        {order.status === "Delivered" && (
                                            <button
                                                className="confirm-btn"
                                                onClick={async () => {
                                                    if (!window.confirm("Confirm you received this order?")) return;
                                                    try {
                                                        const res = await fetch(`http://localhost:5000/api/auth/orders/${order._id}/confirm`, {
                                                            method: "PUT",
                                                            headers: { "Content-Type": "application/json" } // Public endpoint or auth? Auth usually.
                                                        });
                                                        if (res.ok) {
                                                            // Remove from UI immediately
                                                            setOrders(prev => prev.filter(o => o._id !== order._id));
                                                        } else {
                                                            alert("Failed to confirm");
                                                        }
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                }}
                                                style={{
                                                    marginTop: '10px',
                                                    width: '100%',
                                                    padding: '8px',
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                ✓ Confirm Receipt
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Track Order Section (Now Bottom) */}
                <div className="track-order-section" style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                    <div className="track-header">
                        <h2 className="track-title">Track a Specific Order</h2>
                        <p className="track-subtitle">Enter order ID to see details</p>
                    </div>

                    <form onSubmit={handleTrack} className="track-form">
                        <input
                            type="text"
                            placeholder="Enter Order ID (e.g., 64c9a1b2...)"
                            value={trackId}
                            onChange={(e) => setTrackId(e.target.value)}
                            className="track-input"
                        />
                        <button type="submit" disabled={trackLoading} className="track-button">
                            {trackLoading ? "Tracking..." : "Track Order"}
                        </button>
                    </form>

                    {trackError && (
                        <div className="track-error">
                            <span className="error-icon">⚠️</span>
                            <span>{trackError}</span>
                        </div>
                    )}

                    {trackedOrder && (
                        <div className="tracked-order">
                            <div className="tracked-header">
                                <div className="tracked-id">
                                    <span className="tracked-label">Order ID</span>
                                    <span className="tracked-value">#{trackedOrder._id}</span>
                                </div>
                                <span className={`order-status ${trackedOrder.status.toLowerCase()}`}>
                                    {trackedOrder.status}
                                </span>
                            </div>

                            <div className="tracked-items">
                                {trackedOrder.items.map((item, index) => (
                                    <div key={index} className="tracked-item">
                                        <img
                                            src={item.product?.image || 'https://via.placeholder.com/60'}
                                            alt={item.product?.name || 'Product'}
                                            className="tracked-item-image"
                                        />
                                        <div className="tracked-item-info">
                                            <span className="tracked-item-name">
                                                {item.product?.name || 'Unknown Product'}
                                            </span>
                                            <span className="tracked-item-details">
                                                Size: {item.size} • Qty: {item.quantity}
                                            </span>
                                        </div>
                                        <span className="tracked-item-price">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="tracked-details">
                                <div className="tracked-row">
                                    <span className="detail-label">Total Amount</span>
                                    <span className="detail-value">${trackedOrder.totalAmount}</span>
                                </div>
                                <div className="tracked-row">
                                    <span className="detail-label">Order Date</span>
                                    <span className="detail-value">
                                        {new Date(trackedOrder.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default Orders;