import { createSlice } from "@reduxjs/toolkit";

const getCartKey = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.email ? `cart_${user.email}` : "cart_guest";
};

const loadFromLocalStorage = () => {
  try {
    const key = getCartKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (items) => {
  const key = getCartKey();
    localStorage.setItem(key, JSON.stringify(items));
};

const clearLocalStorageCart = () => {
  const key = getCartKey();
  localStorage.removeItem(key);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadFromLocalStorage(),
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((i) => i._id === product._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      saveToLocalStorage(state.items);
    },

    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) item.quantity = quantity;
      if (item && item.quantity <= 0) {
        state.items = state.items.filter((i) => i._id !== id);
      }
      saveToLocalStorage(state.items);
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i._id !== action.payload);
      saveToLocalStorage(state.items);
    },

    clearCart(state) {
      state.items = [];
      clearLocalStorageCart();
    },

    loadUserCart(state) {
      state.items = loadFromLocalStorage();
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  loadUserCart,
} = cartSlice.actions;

export default cartSlice.reducer;