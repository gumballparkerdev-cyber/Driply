// src/api.js
import { getUserId } from "./utils/userId";

const API_URL = "http://localhost:5000/api";

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
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

export const getCart = async () => {
  const res = await fetch(`${API_URL}/cart/${getUserId()}`);
  return handleResponse(res);
};

export const addToCart = async ({ productId, size, quantity }) => {
  const res = await fetch(`${API_URL}/cart/add`, {
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

/* ---------------- CHECKOUT (LATER) ---------------- */

export const checkoutCart = async (items = null) => {
  const res = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: getUserId(),
      items: items // Optional: passed to backend for selective checkout
    }),
  });

  return handleResponse(res);
};
