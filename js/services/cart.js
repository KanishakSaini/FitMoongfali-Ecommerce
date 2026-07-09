// Shared cart service.
// Cart persistence and calculations were previously duplicated between
// script.js and checkout.js. They now live here and are reused by both pages.

import { CART_STORAGE_KEY } from "../config.js";

// Read the saved cart from localStorage. Returns an empty array on any error.
export function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Persist the given cart to localStorage.
export function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Total number of items (sum of quantities) in the cart.
export function countItems(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Total price of the cart, looking each item up in the shared products list.
export function calculateSubtotal(cart, products) {
  return cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return product && typeof product.price === "number" ? sum + product.price * item.quantity : sum;
  }, 0);
}
