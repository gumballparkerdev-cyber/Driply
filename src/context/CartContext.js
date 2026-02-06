import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeCartItem
} from "../api";
import { getUserId } from "../utils/userId";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = getUserId();

  const loadCart = useCallback(async () => {
    try {
      const data = await getCart(userId);
      setCart(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateItem = async (productId, size, quantity) => {
    try {
      await updateCartItem(productId, size, quantity);
      loadCart();
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };


  const removeItem = async (productId, size) => {
    await removeCartItem(productId, size);
    loadCart();
  };

  // 👇 UPDATED
  const addToCart = async ({ productId, size, quantity }) => {
    try {
      await apiAddToCart({
        productId,
        size,
        quantity,
      });
      // refresh cart after successful add
      await loadCart();
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert(err.message || "Failed to add item to cart");
    }
  };



  return (
    <CartContext.Provider value={{ cart, addToCart, updateItem, removeItem, refreshCart: loadCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
