/**
 * Cart Slice - Redux Toolkit
 * Manages shopping cart state with user-specific localStorage persistence
 *
 * Cart data is stored separately for each user based on their email
 * This allows multiple users to have independent carts on the same device
 */

import { createSlice } from "@reduxjs/toolkit";

/**
 * Generate user-specific cart key for localStorage
 * Each user gets their own cart (cart_email@example.com)
 * Guest users use a shared cart (cart_guest)
 * Returns localStorage key for current user's cart
 */
const getCartKey = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.email ? `cart_${user.email}` : "cart_guest";
};

/**
 * Load cart items from localStorage for current user
 * Returns cart items or empty array if not found
 */
const loadFromLocalStorage = () => {
  try {
    const key = getCartKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Save cart items to localStorage for current user
 * Persists cart state across browser sessions
 */
const saveToLocalStorage = (items) => {
  const key = getCartKey();
  localStorage.setItem(key, JSON.stringify(items));
};

/**
 * Clear cart data from localStorage for current user
 */
const clearLocalStorageCart = () => {
  const key = getCartKey();
  localStorage.removeItem(key);
};

// Redux Toolkit slice for cart management
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadFromLocalStorage(), // Load cart from localStorage on initialization
  },
  reducers: {
    /**
     * Add product to cart
     * If product already exists, increment quantity by 1
     * Otherwise, add new product with quantity 1
     * Automatically saves to localStorage after update
     */
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((i) => i._id === product._id);

      if (existing) {
        existing.quantity += 1; // Increment existing product quantity
      } else {
        state.items.push({ ...product, quantity: 1 }); // Add new product
      }

      saveToLocalStorage(state.items); // Persist to localStorage
    },

    /**
     * Update quantity of a cart item
     * If quantity <= 0, removes item from cart
     * Automatically saves to localStorage after update
     */
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) item.quantity = quantity;
      // Remove item if quantity is 0 or negative
      if (item && item.quantity <= 0) {
        state.items = state.items.filter((i) => i._id !== id);
      }
      saveToLocalStorage(state.items);
    },

    /**
     * Remove product from cart by ID
     */
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i._id !== action.payload);
      saveToLocalStorage(state.items);
    },

    /**
     * Clear entire cart
     * Called when user logs out
     * Removes cart data from localStorage
     */
    clearCart(state) {
      state.items = [];
      clearLocalStorageCart();
    },

    /**
     * Load user-specific cart from localStorage
     * Called after user login to restore their cart
     * Each user has their own cart stored separately
     */
    loadUserCart(state) {
      state.items = loadFromLocalStorage();
    },
  },
});

// Export action creators
export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  loadUserCart,
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;