// src/api.js
import { getUserId } from "./utils/userId";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

/* ---------------- PRODUCTS ---------------- */

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  return handleResponse(res);
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  return handleResponse(res);
};

/* ---------------- CART ---------------- */

// ✅ Get cart by userId
export const getCart = async () => {
  const res = await fetch(`${API_URL}/cart/${getUserId()}`);
  return handleResponse(res);
};

// ✅ Add item to cart
export const addToCart = async ({ productId, size, quantity }) => {
  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: getUserId(),
      productId,
      size,
      quantity,
    }),
  });
  return handleResponse(res);
};

// ✅ Update item in cart
export const updateCartItem = async (productId, size, quantity) => {
  const res = await fetch(`${API_URL}/cart/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: getUserId(),
      productId,
      size,
      quantity,
    }),
  });
  return handleResponse(res);
};

// ✅ Remove item from cart
export const removeCartItem = async (productId, size) => {
  const res = await fetch(`${API_URL}/cart/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: getUserId(),
      productId,
      size,
    }),
  });
  return handleResponse(res);
};

/* ---------------- CHECKOUT ---------------- */

export const checkoutCart = async (items = null) => {
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: getUserId(),
      items, // Optional: selective checkout
    }),
  });
  return handleResponse(res);
};