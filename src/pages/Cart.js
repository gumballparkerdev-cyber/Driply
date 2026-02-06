import { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

import "../CSS/Cart.css";
import React from "react";

// ✅ Memoized CartItem for performance
const CartItem = React.memo(
  ({ item, isSelected, toggleSelect, handleUpdateQuantity, handleRemove }) => (
    <div
      className={`cart-item ${isSelected(item.product._id, item.size) ? "selected" : ""}`}
    >
      <div className="item-select">
        <input
          type="checkbox"
          checked={isSelected(item.product._id, item.size)}
          onChange={() => toggleSelect(item.product._id, item.size)}
          className="select-checkbox"
        />
      </div>

      <div className="item-image">
        <img src={item.product.image} alt={item.product.name} />
      </div>

      <div className="item-details">
        <h3 className="item-name">{item.product.name}</h3>
        <p className="item-size">Size: {item.size}</p>
        <p className="item-price">${item.product.price}</p>
      </div>

      <div className="item-quantity">
        <button
          onClick={() => handleUpdateQuantity(item.product._id, item.size, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="qty-btn"
        >
          -
        </button>
        <span className="qty-display">{item.quantity}</span>
        <button
          onClick={() =>
            handleUpdateQuantity(
              item.product._id,
              item.size,
              item.quantity + 1
            )
          }
          disabled={item.quantity >= item.product.stock}
          className="qty-btn"
        >
          +
        </button>

      </div>

      <div className="item-total">
        <p className="total-price">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>

      <button
        onClick={() => handleRemove(item.product._id, item.size)}
        className="remove-btn"
      >
        ×
      </button>
    </div>
  )
);

function Cart() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [localCart, setLocalCart] = useState([]);
  const navigate = useNavigate();

  // Sync localCart with cart from context
  React.useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  // ✅ Hooks always at the top
  const isSelected = (productId, size) => selectedItems.includes(`${productId}-${size}`);

  const selectedTotal = useMemo(() => {
    return localCart
      .filter(item => isSelected(item.product._id, item.size))
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  }, [localCart, selectedItems]);

  const getSelectedItems = () => localCart.filter(item => isSelected(item.product._id, item.size));

  // Handlers
  const toggleSelect = (productId, size) => {
    const itemKey = `${productId}-${size}`;
    setSelectedItems(prev =>
      prev.includes(itemKey) ? prev.filter(key => key !== itemKey) : [...prev, itemKey]
    );
  };

  const handleUpdateQuantity = async (productId, size, newQuantity) => {
    if (newQuantity < 1) return;

    const item = localCart.find(
      i => i.product._id === productId && i.size === size
    );

    if (!item) return;

    if (newQuantity > item.product.stock) return;

    // Optimistic UI
    setLocalCart(prev =>
      prev.map(i =>
        i.product._id === productId && i.size === size
          ? { ...i, quantity: newQuantity }
          : i
      )
    );

    try {
      await updateItem(productId, size, newQuantity);
    } catch (err) {
      setLocalCart(cart); // revert
      console.error(err);
    }
  };


  const handleRemove = async (productId, size) => {
    // ✅ Optimistic update - remove from UI immediately
    setLocalCart(prevCart =>
      prevCart.filter(item => !(item.product._id === productId && item.size === size))
    );

    // Remove from selected items
    const key = `${productId}-${size}`;
    setSelectedItems(prev => prev.filter(k => k !== key));

    // Then update backend
    try {
      await removeItem(productId, size);
    } catch (error) {
      // If it fails, revert to original cart
      setLocalCart(cart);
      console.error("Failed to remove item:", error);
    }
  };

  // ✅ Conditional rendering inside JSX, not before hooks
  return (
    <>
      <div className="cart-container">
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : localCart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart!</p>
        </div>
      ) : (
        <>
          <div className="cart-main">
            <h1 className="cart-title">Your Cart</h1>
            <p className="cart-subtitle">{localCart.length} items in your cart</p>

            <div className="cart-items">
              {localCart.map(item => (
                <CartItem
                  key={item.product._id + item.size}
                  item={item}
                  isSelected={isSelected}
                  toggleSelect={toggleSelect}
                  handleUpdateQuantity={handleUpdateQuantity}
                  handleRemove={handleRemove}
                />
              ))}
            </div>
          </div>

          {/* Checkout Sidebar */}
          <div className="checkout-sidebar">
            <div className="checkout-sticky">
              <h2 className="checkout-title">Order Summary</h2>

              {getSelectedItems().length === 0 ? (
                <p className="no-selection">No items selected</p>
              ) : (
                <>
                  <div className="selected-items-list">
                    {getSelectedItems().map(item => (
                      <div key={item.product._id + item.size} className="checkout-item">
                        <div className="checkout-item-info">
                          <p className="checkout-item-name">{item.product.name}</p>
                          <p className="checkout-item-details">
                            Size: {item.size} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="checkout-item-price">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-summary">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${selectedTotal}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="summary-row total-row">
                      <span>Total</span>
                      <span>${selectedTotal}</span>
                    </div>
                  </div>

                  <button
                    className="checkout-btn"
                    onClick={() => {
                      const selected = getSelectedItems().map(item => ({
                        productId: item.product._id,
                        size: item.size,
                        quantity: item.quantity
                      }));
                      navigate("/checkout", { state: { items: selected } });
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
}

export default Cart;